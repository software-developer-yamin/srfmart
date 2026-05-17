import { User } from "@srfmart/db/models/auth.model";
import { Idempotency } from "@srfmart/db/models/idempotency.model";
import { Transaction } from "@srfmart/db/models/transaction.model";
import express from "express";
import request from "supertest";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
} from "vitest";
import { transactionRoutes } from "../routes/transactions";
import {
	clearDatabase,
	connectReplicaSet,
	disconnectReplicaSet,
} from "./setup/db";

const app = express();
app.use(express.json());

// Mock auth middleware for the route
app.use(
	(
		req: express.Request,
		_res: express.Response,
		next: express.NextFunction
	) => {
		// Set log object logic since our app uses it
		req.log = { error: () => undefined, info: () => undefined } as any;

		// Check the test's mock role preference header
		const mockRole = req.header("X-Mock-Role");
		const mockUserId = req.header("X-Mock-User-Id");

		if (mockRole) {
			req.auth = {
				getSession: async () => ({
					user: { role: mockRole, id: mockUserId || "user-123" },
				}),
			} as any;
		}
		next();
	}
);

app.use("/api/transactions", transactionRoutes);

describe("Transaction Routes (Minting)", () => {
	let adminUser: any;

	beforeAll(async () => {
		await connectReplicaSet();
	});

	afterAll(async () => {
		await disconnectReplicaSet();
	});

	beforeEach(async () => {
		adminUser = await User.create({
			_id: "admin-123",
			name: "Admin User",
			email: "admin@example.com",
			emailVerified: true,
			role: "admin",
			createdAt: new Date(),
			updatedAt: new Date(),
			availableBalance: 0,
		});
	});

	afterEach(async () => {
		await clearDatabase();
	});

	it("should return 400 if idempotency key is missing", async () => {
		const res = await request(app)
			.post("/api/transactions/mint")
			.set("X-Mock-Role", "admin")
			.set("X-Mock-User-Id", adminUser._id)
			.send({ amount: 100 });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("Idempotency-Key header is required");
	});

	it("should return 403 if user is not an admin", async () => {
		const res = await request(app)
			.post("/api/transactions/mint")
			.set("Idempotency-Key", "test-key-1")
			.set("X-Mock-Role", "moderator")
			.set("X-Mock-User-Id", "mod-123")
			.send({ amount: 100 });

		expect(res.status).toBe(403);
	});

	it("should return 400 if amount is not a positive number", async () => {
		const res = await request(app)
			.post("/api/transactions/mint")
			.set("Idempotency-Key", "test-key-2")
			.set("X-Mock-Role", "admin")
			.set("X-Mock-User-Id", adminUser._id)
			.send({ amount: -50 });

		expect(res.status).toBe(400);
		expect(res.body.message).toContain("must be a positive number");
	});

	it("should mint points successfully and update balance atomically", async () => {
		const key = "valid-mint-key";

		const res = await request(app)
			.post("/api/transactions/mint")
			.set("Idempotency-Key", key)
			.set("X-Mock-Role", "admin")
			.set("X-Mock-User-Id", adminUser._id)
			.send({ amount: 500 });

		expect(res.status).toBe(200);
		expect(res.body.message).toContain("Successfully minted 500 points");

		// Validate ledger transaction
		const tx = await Transaction.findOne({ idempotencyKey: key });
		expect(tx).toBeDefined();
		expect(tx?.type).toBe("MINT");
		expect(tx?.amount).toBe(500);
		expect(tx?.receiverId).toBe(adminUser._id);

		// Validate user balance update
		const user = await User.findById(adminUser._id);
		expect(user?.availableBalance).toBe(500);

		// Let background idempotency persistence finish
		await new Promise((resolve) => setTimeout(resolve, 50));

		const cached = await Idempotency.findOne({ key });
		expect(cached).toBeDefined();
		expect(cached?.statusCode).toBe(200);
	});

	it("should not double-mint when repeating request with the same idempotency key", async () => {
		const key = "repeat-mint-key";

		// 1. Initial Mint
		await request(app)
			.post("/api/transactions/mint")
			.set("Idempotency-Key", key)
			.set("X-Mock-Role", "admin")
			.set("X-Mock-User-Id", adminUser._id)
			.send({ amount: 500 });

		// Wait for middleware save
		await new Promise((resolve) => setTimeout(resolve, 50));

		// 2. Repeat Request (Should return the cached success, but NOT mint again)
		const res = await request(app)
			.post("/api/transactions/mint")
			.set("Idempotency-Key", key)
			.set("X-Mock-Role", "admin")
			.set("X-Mock-User-Id", adminUser._id)
			.send({ amount: 500 });

		expect(res.status).toBe(200);

		// Validate that the balance is STILL 500
		const user = await User.findById(adminUser._id);
		expect(user?.availableBalance).toBe(500);

		// Only 1 transaction document should exist
		const count = await Transaction.countDocuments({ idempotencyKey: key });
		expect(count).toBe(1);
	});
});

import { Idempotency } from "@srfmart/db/models/idempotency.model";
import type { NextFunction, Request, Response } from "express";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { idempotencyMiddleware } from "../middleware/idempotency";
import {
	clearDatabase,
	connectReplicaSet,
	disconnectReplicaSet,
} from "./setup/db";

beforeAll(async () => {
	await connectReplicaSet();
});

afterAll(async () => {
	await disconnectReplicaSet();
});

describe("Idempotency Middleware", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		req = {
			header: vi.fn(),
		};
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			statusCode: 200,
		};
		next = vi.fn();
	});

	afterEach(async () => {
		await clearDatabase();
	});

	it("should reject requests without Idempotency-Key header", async () => {
		(req.header as any).mockReturnValue(undefined);

		await idempotencyMiddleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Idempotency-Key header is required",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("should return cached response if key exists", async () => {
		const idempotencyKey = "existing-key-123";
		(req.header as any).mockReturnValue(idempotencyKey);

		// Insert cached response simulating a past successful operation
		await Idempotency.create({
			key: idempotencyKey,
			statusCode: 201,
			response: { success: true, dummy: "data" },
		});

		await idempotencyMiddleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ success: true, dummy: "data" });
		expect(next).not.toHaveBeenCalled();
	});

	it("should proceed to next() and save response if key is new", async () => {
		const idempotencyKey = "new-key-456";
		(req.header as any).mockReturnValue(idempotencyKey);

		await idempotencyMiddleware(req as Request, res as Response, next);

		expect(next).toHaveBeenCalled();

		// Simulate handler finishing and sending a response
		res.statusCode = 200;
		const responseBody = { success: true, amount: 100 };

		// Wait essentially for the promise tracking in middleware to settle or simply call tracked method
		res.json?.(responseBody);

		// Give async interceptor DB promise a tick to evaluate
		await new Promise((resolve) => setTimeout(resolve, 50));

		const savedKey = await Idempotency.findOne({ key: idempotencyKey });
		expect(savedKey).toBeTruthy();
		expect(savedKey?.statusCode).toBe(200);
		expect(savedKey?.response).toEqual(responseBody);
	});

	it("should not cache 5xx server errors", async () => {
		const idempotencyKey = "error-key-5xx";
		(req.header as any).mockReturnValue(idempotencyKey);

		await idempotencyMiddleware(req as Request, res as Response, next);

		expect(next).toHaveBeenCalled();

		// Simulate handler failing and sending 500 error
		res.statusCode = 500;
		const responseBody = { success: false, message: "Server died" };

		res.json?.(responseBody);

		await new Promise((resolve) => setTimeout(resolve, 50));

		const savedKey = await Idempotency.findOne({ key: idempotencyKey });
		expect(savedKey).toBeNull(); // Should not have saved
	});

	it("should cache 4xx client errors", async () => {
		const idempotencyKey = "error-key-4xx";
		(req.header as any).mockReturnValue(idempotencyKey);

		await idempotencyMiddleware(req as Request, res as Response, next);

		expect(next).toHaveBeenCalled();

		// Simulate handler failing for unrecoverable business logic rule
		res.statusCode = 400;
		const responseBody = { success: false, message: "Insufficient balance" };

		res.json?.(responseBody);

		await new Promise((resolve) => setTimeout(resolve, 50));

		const savedKey = await Idempotency.findOne({ key: idempotencyKey });
		expect(savedKey).toBeTruthy();
		expect(savedKey?.statusCode).toBe(400);
	});
});

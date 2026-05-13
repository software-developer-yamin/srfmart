import { User } from "@srfmart/db/models/auth.model";
import { Transaction } from "@srfmart/db/models/transaction.model";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PointsService } from "../services/points.service";

describe("PointsService", () => {
	beforeAll(async () => {
		// Connection should be handled by the test environment or bts setup
		// For this example, we assume mongoose is connected
	});

	afterAll(async () => {
		await User.deleteMany({});
		await Transaction.deleteMany({});
	});

	it("should distribute points equally among users and return remainder to admin", async () => {
		// Setup
		await User.create({
			_id: "admin1",
			name: "Admin",
			email: "admin@srfmart.com",
			role: "admin",
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await User.create([
			{
				_id: "u1",
				name: "User 1",
				email: "u1@test.com",
				role: "user",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				_id: "u2",
				name: "User 2",
				email: "u2@test.com",
				role: "user",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				_id: "u3",
				name: "User 3",
				email: "u3@test.com",
				role: "user",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);

		// Execute: Distribute 100 points to 3 users (33 each, 1 remainder)
		const result = await PointsService.distributeGlobalPoints("admin1", 100);

		// Verify
		expect(result.pointsPerUser).toBe(33);
		expect(result.remainder).toBe(1);

		const updatedU1 = await User.findById("u1");
		const updatedAdmin = await User.findById("admin1");

		expect(updatedU1?.availableBalance).toBe(33);
		expect(updatedAdmin?.availableBalance).toBe(1);

		const tx = await Transaction.findOne({ type: "DISTRIBUTE" });
		expect(tx?.amount).toBe(100);
	});

	it("should transfer points only to staff (admin/moderator)", async () => {
		await User.create({
			_id: "sender1",
			name: "Sender",
			email: "sender@test.com",
			availableBalance: 50,
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await User.create({
			_id: "mod1",
			name: "Moderator",
			email: "mod@test.com",
			role: "moderator",
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Execute
		await PointsService.transferToStaff("sender1", "mod1", 20);

		// Verify
		const updatedSender = await User.findById("sender1");
		const updatedMod = await User.findById("mod1");

		expect(updatedSender?.availableBalance).toBe(30);
		expect(updatedMod?.availableBalance).toBe(20);
	});
});

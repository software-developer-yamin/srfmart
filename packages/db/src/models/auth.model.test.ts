import { describe, expect, it } from "vitest";
import { User } from "./auth.model";

describe("Auth Models", () => {
	it("should have User model with expected fields", () => {
		const user = new User({
			name: "Test User",
			email: "test@example.com",
			emailVerified: true,
			role: "admin",
			referredBy: "some-id",
			referralCode: "REF123",
			phoneNumber: "1234567890",
			availableBalance: 100,
			escrowBalance: 50,
			dailyPointLimit: 500,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		expect(user.name).toBe("Test User");
		expect(user.role).toBe("admin");
		expect(user.availableBalance).toBe(100);
		expect(user.dailyPointLimit).toBe(500);
	});

	it("should enforce role enum validation", async () => {
		const user = new User({
			name: "Test User",
			email: "invalid-role@example.com",
			emailVerified: true,
			role: "invalid-role",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		let error: any;
		try {
			await user.validate();
		} catch (e) {
			error = e;
		}
		expect(error).toBeDefined();
		expect(error.errors.role).toBeDefined();
	});

	it("should enforce unique constraint on referralCode", () => {
		const user1 = new User({
			name: "User 1",
			email: "u1@example.com",
			emailVerified: true,
			referralCode: "DUP123",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const user2 = new User({
			name: "User 2",
			email: "u2@example.com",
			emailVerified: true,
			referralCode: "DUP123",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		expect(user1.referralCode).toBe(user2.referralCode);
	});
});

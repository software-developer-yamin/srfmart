import { describe, expect, it } from "vitest";
import { Account, Session, User, Verification } from "./auth.model";

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

	it("should export all required models", () => {
		expect(User).toBeDefined();
		expect(Session).toBeDefined();
		expect(Account).toBeDefined();
		expect(Verification).toBeDefined();
	});
});

import { describe, expect, it, vi } from "vitest";

vi.mock("@srfmart/db", () => ({
	client: {
		collection: vi.fn(),
	},
}));

vi.mock("@srfmart/db/models/auth.model", () => ({
	User: {
		findOne: vi.fn().mockImplementation(() => ({
			lean: vi.fn().mockResolvedValue(null),
			exec: vi.fn().mockResolvedValue(null),
		})),
	},
}));

import { User } from "@srfmart/db/models/auth.model";
import { createAuth } from "../src/index";

describe("Referral Gate Validation", () => {
	it("should fail without referral code", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		const userData = {
			email: "test@example.com",
			name: "Test User",
		};

		await expect(beforeHook(userData as any, {} as any)).rejects.toThrow(
			"Referral code is required"
		);
	});

	it("should fail with invalid referral code", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		(User.findOne as any).mockImplementation(() => ({
			lean: vi.fn().mockResolvedValue(null),
		}));

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "INVALID",
		};

		await expect(beforeHook(userData as any, {} as any)).rejects.toThrow(
			"Invalid referral code"
		);
	});

	it("should succeed with valid referral code", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		const referrer = { _id: "referrer-id", email: "ref@example.com" };
		(User.findOne as any).mockImplementation(() => ({
			lean: vi.fn().mockResolvedValue(referrer),
		}));

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "VALID123",
		};

		const result = await beforeHook(userData as any, {} as any);
		expect(result).toBeDefined();
		if (result && typeof result === "object" && "data" in result) {
			expect((result.data as any).referredBy).toBe("referrer-id");
		} else {
			throw new Error("Result should contain data");
		}
	});

	it("should fail on self-referral", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		const referrer = { _id: "referrer-id", email: "test@example.com" };
		(User.findOne as any).mockImplementation(() => ({
			lean: vi.fn().mockResolvedValue(referrer),
		}));

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "SELF",
		};

		await expect(beforeHook(userData as any, {} as any)).rejects.toThrow(
			"Self-referral is not allowed"
		);
	});
});

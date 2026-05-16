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

		// Cast to unknown first to safely simulate external input without 'any'
		await expect(
			beforeHook(userData as unknown as any, {} as any)
		).rejects.toThrow("Referral code is required");
	});

	it("should fail with invalid referral code", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		const mockFindOne = User.findOne as unknown as {
			mockImplementation: (fn: () => { lean: () => Promise<unknown> }) => void;
		};
		mockFindOne.mockImplementation(() => ({
			lean: vi.fn().mockResolvedValue(null),
		}));

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "INVALID",
		};

		await expect(
			beforeHook(userData as unknown as { email: string }, {} as any)
		).rejects.toThrow("Invalid referral code");
	});

	it("should fail with long referral code", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "A_VERY_LONG_CODE_THAT_EXCEEDS_TWENTY_CHARACTERS",
		};

		await expect(
			beforeHook(userData as unknown as any, {} as any)
		).rejects.toThrow("Invalid referral code format");
	});

	it("should fail with short referral code", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "XY",
		};

		await expect(
			beforeHook(userData as unknown as any, {} as any)
		).rejects.toThrow("Invalid referral code format");
	});

	it("should succeed with valid referral code", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (!beforeHook) {
			throw new Error("before hook not defined");
		}

		const referrer = { _id: "referrer-id", email: "ref@example.com" };
		const mockFindOne = User.findOne as unknown as {
			mockImplementation: (fn: () => any) => void;
		};
		mockFindOne.mockImplementation(() => ({
			lean: vi.fn().mockResolvedValue(referrer),
		}));

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "VALID123",
		};

		const result = await beforeHook(userData as unknown as any, {} as any);
		expect(result).toBeDefined();
		if (result && typeof result === "object" && "data" in result) {
			const data = result.data as { referredBy: string };
			expect(data.referredBy).toBe("referrer-id");
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
		const mockFindOne = User.findOne as unknown as {
			mockImplementation: (fn: () => any) => void;
		};
		mockFindOne.mockImplementation(() => ({
			lean: vi.fn().mockResolvedValue(referrer),
		}));

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "SELF",
		};

		await expect(
			beforeHook(userData as unknown as any, {} as any)
		).rejects.toThrow("Self-referral is not allowed");
	});
});

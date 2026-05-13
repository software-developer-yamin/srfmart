import { APIError } from "better-auth/api";
import { describe, expect, it, vi } from "vitest";

// Mocking environment and dependencies before importing anything that uses them
vi.mock("@srfmart/env/server", () => ({
	env: {
		DATABASE_URL: "mongodb://localhost:27017/test",
		BETTER_AUTH_SECRET: "secret",
		BETTER_AUTH_URL: "http://localhost:3000",
		CORS_ORIGIN: "http://localhost:3000",
	},
}));

vi.mock("@srfmart/db", () => ({
	client: {},
}));

vi.mock("@srfmart/db/models/auth.model", () => ({
	User: {
		findOne: vi.fn(),
	},
}));

import { User } from "@srfmart/db/models/auth.model";
import { createAuth } from "../src/index";

describe("Referral Gate Validation", () => {
	it("should throw UNPROCESSABLE_ENTITY if referral code is missing", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (typeof beforeHook !== "function") {
			throw new Error("before hook not defined");
		}

		const userData = {
			email: "test@example.com",
			name: "Test User",
		};

		await expect(beforeHook(userData as any, {} as any)).rejects.toThrow(
			new APIError("UNPROCESSABLE_ENTITY", {
				message: "Referral code is required.",
			})
		);
	});

	it("should throw UNPROCESSABLE_ENTITY if referral code is invalid", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (typeof beforeHook !== "function") {
			throw new Error("before hook not defined");
		}

		(User.findOne as any).mockResolvedValue(null);

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "INVALID",
		};

		await expect(beforeHook(userData as any, {} as any)).rejects.toThrow(
			new APIError("UNPROCESSABLE_ENTITY", {
				message: "Invalid referral code.",
			})
		);
	});

	it("should succeed and set referredBy if referral code is valid", async () => {
		const auth = createAuth();
		const beforeHook = auth.options.databaseHooks?.user?.create?.before;

		if (typeof beforeHook !== "function") {
			throw new Error("before hook not defined");
		}

		const referrer = { _id: "referrer-id", referralCode: "VALID123" };
		(User.findOne as any).mockResolvedValue(referrer);

		const userData = {
			email: "test@example.com",
			name: "Test User",
			referralCode: "VALID123",
		};

		const result = await beforeHook(userData as any, {} as any);

		expect(User.findOne).toHaveBeenCalledWith({ referralCode: "VALID123" });
		expect(result).toEqual({
			data: {
				...userData,
				referredBy: "referrer-id",
			},
		});
	});
});

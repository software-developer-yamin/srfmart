import { describe, expect, it, vi } from "vitest";

// Mocking environment and dependencies before importing anything that uses them
vi.mock("@srfmart/env/server", () => ({
	env: {
		DATABASE_URL: "mongodb://localhost:27017/test",
		BETTER_AUTH_SECRET: "secret-at-least-32-chars-long-for-test",
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

import { createAuth } from "../src/index";

describe("Email OTP Plugin Configuration", () => {
	it("should have emailOTP plugin configured with correct limits", () => {
		const auth = createAuth();
		const emailOtpPlugin = auth.options.plugins?.find(
			(p: any) => p.id === "email-otp"
		);

		expect(emailOtpPlugin).toBeDefined();
		expect(emailOtpPlugin.options).toMatchObject({
			expiresIn: 300,
			allowedAttempts: 3,
		});
	});

	it("should have sendVerificationOTP implementation", () => {
		const auth = createAuth();
		const emailOtpPlugin = auth.options.plugins?.find(
			(p: any) => p.id === "email-otp"
		);

		expect(emailOtpPlugin.options.sendVerificationOTP).toBeTypeOf("function");
	});
});

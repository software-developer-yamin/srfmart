import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		RESEND_API_KEY: z.string().min(1),
		MAIL_FROM: z.string().email().default("onboarding@resend.dev"),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		ENABLE_TESTING_EMAIL: z.boolean().default(true),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});

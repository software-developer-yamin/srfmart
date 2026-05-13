import { client } from "@srfmart/db";
import { env } from "@srfmart/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export function createAuth() {
	return betterAuth({
		database: mongodbAdapter(client),
		trustedOrigins: [env.CORS_ORIGIN],
		user: {
			additionalFields: {
				role: {
					type: "string",
					defaultValue: "user",
				},
				referredBy: {
					type: "string",
					required: false,
				},
				referralCode: {
					type: "string",
					required: false,
				},
				phoneNumber: {
					type: "string",
					required: false,
				},
				availableBalance: {
					type: "number",
					defaultValue: 0,
				},
				escrowBalance: {
					type: "number",
					defaultValue: 0,
				},
				dailyPointLimit: {
					type: "number",
					required: false,
				},
			},
		},
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
	});
}

export const auth = createAuth();

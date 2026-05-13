import { client } from "@srfmart/db";
import { User as UserModel } from "@srfmart/db/models/auth.model";
import { env } from "@srfmart/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";

interface ReferralUser {
	_id: { toString: () => string };
	email?: string;
}

export function createAuth() {
	const authInstance = betterAuth({
		database: mongodbAdapter(client),
		trustedOrigins: [env.CORS_ORIGIN],
		plugins: [
			emailOTP({
				expiresIn: 300,
				allowedAttempts: 3,
				sendVerificationOTP: async ({ email, type }) => {
					await Promise.resolve();
					if (process.env.NODE_ENV === "development") {
						console.log(`[AUTH] OTP requested for ${email} (${type})`);
					}
				},
			}),
		],
		databaseHooks: {
			user: {
				create: {
					before: async (user) => {
						const referralCode = (user as Record<string, unknown>).referralCode;

						if (!referralCode || typeof referralCode !== "string") {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Referral code is required.",
							});
						}

						if (referralCode.length > 20) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Invalid referral code format.",
							});
						}

						const cleanCode = referralCode.trim().toUpperCase();

						if (!user.email) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Email is required for sign up.",
							});
						}

						const referrerDoc = await UserModel.findOne({
							referralCode: cleanCode,
						}).lean();

						if (!referrerDoc) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Invalid referral code.",
							});
						}

						const referrer = referrerDoc as unknown as ReferralUser;

						if (
							referrer.email &&
							user.email &&
							referrer.email.toLowerCase() === user.email.toLowerCase()
						) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Self-referral is not allowed.",
							});
						}

						return {
							data: {
								...user,
								referredBy: referrer._id.toString(),
							},
						};
					},
				},
			},
		},
		user: {
			additionalFields: {
				role: {
					type: "string",
					defaultValue: "user",
					input: false,
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
	});

	return authInstance;
}

export const auth = createAuth();

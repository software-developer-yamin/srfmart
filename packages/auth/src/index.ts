import { client } from "@srfmart/db";
import { User } from "@srfmart/db/models/auth.model";
import { env } from "@srfmart/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";

export function createAuth() {
	return betterAuth({
		database: mongodbAdapter(client),
		trustedOrigins: [env.CORS_ORIGIN],
		plugins: [
			emailOTP({
				expiresIn: 300,
				allowedAttempts: 3,
				sendVerificationOTP: async ({ email, otp, type }) => {
					await Promise.resolve(); // satisfy linter for now
					console.log(`[AUTH] Sending ${type} OTP to ${email}: ${otp}`);
					// Implementation for real email service would go here
				},
			}),
		],
		databaseHooks: {
			user: {
				create: {
					before: async (user) => {
						const untypedUser = user as {
							email: string;
							referralCode?: string;
						};
						let referralCode = untypedUser.referralCode;

						if (!referralCode) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Referral code is required.",
							});
						}

						if (typeof referralCode !== "string" || referralCode.length > 20) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Invalid referral code format.",
							});
						}

						referralCode = referralCode.trim().toUpperCase();

						if (!user.email) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Email is required for sign up.",
							});
						}

						let referrer: {
							_id: { toString: () => string };
							email?: string;
						} | null;
						try {
							const doc = await User.findOne({ referralCode }).lean();
							referrer = doc
								? (doc as unknown as {
										_id: { toString: () => string };
										email?: string;
									})
								: null;
						} catch (error) {
							console.error("Referral DB Error:", error);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Database error during referral validation.",
							});
						}

						if (!referrer) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Invalid referral code.",
							});
						}

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
					input: false, // Prevent user from setting their own role
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
}

export const auth = createAuth();

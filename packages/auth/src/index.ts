import { client } from "@srfmart/db";
import { User as UserModel } from "@srfmart/db/models/auth.model";
import { env } from "@srfmart/env/server";
import { sendEmail, VerificationEmail } from "@srfmart/mail";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError } from "better-auth/api";
import { admin, emailOTP } from "better-auth/plugins";
import React from "react";

interface UserCreateData {
	email: string;
	referralCode?: string;
}

async function validateReferral(
	email: string,
	referralCode?: string,
	isAdminAction?: boolean
) {
	if (isAdminAction) {
		return {
			referredBy: undefined,
			referralCode: undefined,
		};
	}

	if (!referralCode || typeof referralCode !== "string") {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			message: "Referral code is required.",
		});
	}

	const cleanCode = referralCode.trim().toUpperCase();
	if (cleanCode.length < 3 || cleanCode.length > 20) {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			message: "Invalid referral code format.",
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

	if (!referrerDoc._id || typeof referrerDoc.email !== "string") {
		throw new APIError("INTERNAL_SERVER_ERROR", {
			message: "Referrer data is corrupted.",
		});
	}

	if (referrerDoc.email.toLowerCase() === email.toLowerCase()) {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			message: "Self-referral is not allowed.",
		});
	}

	return {
		referredBy: referrerDoc._id.toString(),
	};
}

export function createAuth() {
	const authInstance = betterAuth({
		database: mongodbAdapter(client),
		trustedOrigins: [env.CORS_ORIGIN],
		plugins: [
			admin(),
			emailOTP({
				expiresIn: 300,
				allowedAttempts: 3,
				sendVerificationOTP: async ({ email, otp, type }) => {
					await sendEmail({
						from: env.MAIL_FROM,
						to: env.ENABLE_TESTING_EMAIL
							? "software.developer.yamin@gmail.com"
							: email,
						subject:
							type === "email-verification"
								? "Verify your email"
								: "Your verification code",
						react: React.createElement(VerificationEmail, { otp }),
						html: "",
					});
				},
			}),
		],
		databaseHooks: {
			user: {
				create: {
					before: async (user) => {
						if (!user || typeof user !== "object") {
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Invalid user data.",
							});
						}

						const input = user as UserCreateData & { isAdminAction?: boolean };
						if (!input.email) {
							throw new APIError("UNPROCESSABLE_ENTITY", {
								message: "Email is required for sign up.",
							});
						}

						const { referredBy, referralCode } = await validateReferral(
							input.email,
							input.referralCode,
							input.isAdminAction
						);

						return {
							data: {
								...user,
								referredBy,
								referralCode,
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
		advanced: {
			cookies: {
				sessionToken: {
					attributes: {
						sameSite: "none",
						secure: true,
						httpOnly: true,
					},
				},
			},
		},
	});

	return authInstance;
}

export * from "./roles";
export const auth = createAuth();

export const UserRole = {
	ADMIN: "admin",
	MODERATOR: "moderator",
	USER: "user",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

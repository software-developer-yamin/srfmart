import { auth, UserRole } from "@srfmart/auth";
import { User as UserModel } from "@srfmart/db/models/auth.model";
import { type Request, type Response, Router } from "express";
import type { FilterQuery, SortOrder } from "mongoose";
import { requireRole } from "../lib/require-role";

const router = Router();

interface SearchQuery {
	limit?: string;
	page?: string;
	query?: string;
	role?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

interface RoleUpdateBody {
	role: string;
}

/**
 * Admin User Search
 */
router.get(
	"/search",
	requireRole([UserRole.ADMIN]),
	async (req: Request, res: Response) => {
		try {
			const searchQuery = req.query as unknown as SearchQuery;
			const queryParam = searchQuery.query?.slice(0, 100);
			const roleFilter = searchQuery.role;
			const pageParam = searchQuery.page ?? "1";
			const limitParam = searchQuery.limit ?? "10";
			const sortBy = searchQuery.sortBy;
			const sortOrder = searchQuery.sortOrder;

			const pageNum = Math.max(1, Number.parseInt(pageParam, 10) || 1);
			const limitNum = Math.min(
				100,
				Math.max(1, Number.parseInt(limitParam, 10) || 10)
			);
			const skip = (pageNum - 1) * limitNum;

			const filter: FilterQuery<typeof UserModel> = {};

			if (queryParam) {
				const escapedQuery = queryParam.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const searchRegex = new RegExp(escapedQuery, "i");
				filter.$or = [{ email: searchRegex }, { phoneNumber: searchRegex }];
			}

			if (
				roleFilter &&
				Object.values(UserRole).includes(roleFilter as UserRole)
			) {
				filter.role = roleFilter;
			}

			const sort: Record<string, SortOrder> = {};
			const allowedSortFields = ["email", "name", "role", "referralCode"];
			if (sortBy && allowedSortFields.includes(sortBy)) {
				sort[sortBy] = sortOrder === "desc" ? -1 : 1;
			} else {
				sort.email = 1;
			}

			const [users, total] = await Promise.all([
				UserModel.find(filter)
					.select("email name role referralCode phoneNumber")
					.sort(sort)
					.skip(skip)
					.limit(limitNum)
					.lean(),
				UserModel.countDocuments(filter),
			]);

			return res.status(200).json({
				success: true,
				data: {
					users: users ?? [],
					pagination: {
						total,
						page: pageNum,
						limit: limitNum,
						totalPages: Math.ceil(total / limitNum),
					},
				},
			});
		} catch (error) {
			req.log?.error("Admin user search failed", { error });
			return res.status(500).json({
				success: false,
				error: {
					message: "Failed to search users",
					code: "INTERNAL_SERVER_ERROR",
				},
			});
		}
	}
);

/**
 * Update User Role
 */
router.post(
	"/:id/role",
	requireRole([UserRole.ADMIN]),
	async (
		req: Request<Record<string, string>, unknown, RoleUpdateBody>,
		res: Response
	) => {
		try {
			const { id } = req.params;
			const { role } = req.body;

			if (!id) {
				return res.status(400).json({
					success: false,
					error: { message: "User ID is required", code: "BAD_REQUEST" },
				});
			}

			const validRoles: string[] = Object.values(UserRole);
			const isValidRole = role && validRoles.includes(role);
			if (!isValidRole) {
				return res.status(400).json({
					success: false,
					error: { message: "Invalid role specified", code: "BAD_REQUEST" },
				});
			}

			const targetUser = await UserModel.findById(id);
			if (!targetUser) {
				return res.status(404).json({
					success: false,
					error: { message: "User not found", code: "NOT_FOUND" },
				});
			}

			const headers = new Headers();
			if (req.headers.cookie) {
				headers.set("cookie", String(req.headers.cookie));
			}
			if (req.headers.authorization) {
				headers.set("authorization", String(req.headers.authorization));
			}

			if (role === UserRole.ADMIN || role === UserRole.USER) {
				const targetRole = role as "admin" | "user";
				await auth.api.setRole({
					headers,
					body: { userId: String(id), role: targetRole },
				});
			} else if (role === UserRole.MODERATOR) {
				await UserModel.findByIdAndUpdate(id, { role: UserRole.MODERATOR });

				const sessionsResult = await auth.api.listUserSessions({
					headers,
					body: { userId: String(id) },
				});
				if (sessionsResult && Array.isArray(sessionsResult)) {
					for (const session of sessionsResult) {
						const token = session?.token;
						if (typeof token === "string") {
							await auth.api.revokeSession({
								headers,
								body: { token },
							});
						}
					}
				}
			}

			return res.status(200).json({
				success: true,
				message: `User role updated to ${role}`,
			});
		} catch (error) {
			req.log?.error("Update user role failed", { error });
			return res.status(500).json({
				success: false,
				error: {
					message: "Failed to update user role",
					code: "INTERNAL_SERVER_ERROR",
				},
			});
		}
	}
);

/**
 * Generate Referral Code
 */
router.post(
	"/:id/referral-code",
	requireRole([UserRole.ADMIN]),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({
					success: false,
					error: { message: "User ID is required", code: "BAD_REQUEST" },
				});
			}

			const targetUser = await UserModel.findById(id);
			if (!targetUser) {
				return res.status(404).json({
					success: false,
					error: { message: "User not found", code: "NOT_FOUND" },
				});
			}

			if (targetUser.referralCode) {
				return res.status(400).json({
					success: false,
					error: { message: "User already has a code", code: "BAD_REQUEST" },
				});
			}

			const allowedRoles: string[] = [UserRole.MODERATOR, UserRole.ADMIN];
			if (!allowedRoles.includes(targetUser.role)) {
				return res.status(400).json({
					success: false,
					error: {
						message: "Codes only for Moderators or Admins",
						code: "BAD_REQUEST",
					},
				});
			}

			let referralCode = "";
			let isUnique = false;
			let attempts = 0;
			while (!isUnique && attempts < 10) {
				referralCode = `MOD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
				try {
					const updated = await UserModel.findOneAndUpdate(
						{ _id: id, referralCode: { $exists: false } },
						{ $set: { referralCode } },
						{ new: true }
					);
					if (updated) {
						isUnique = true;
						return res
							.status(200)
							.json({ success: true, data: { referralCode } });
					}
				} catch (err: unknown) {
					const error = err as { code?: number };
					if (error.code !== 11_000) {
						throw err;
					}
				}
				attempts++;
			}

			throw new Error("Failed to generate unique referral code");
		} catch (error) {
			req.log?.error("Generate referral code failed", { error });
			return res.status(500).json({
				success: false,
				error: {
					message: "Failed to generate referral code",
					code: "INTERNAL_SERVER_ERROR",
				},
			});
		}
	}
);

export const userRoutes = router;

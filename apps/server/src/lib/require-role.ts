import type { NextFunction, Request, Response } from "express";

export const requireRole =
	(allowedRoles: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const session = await req.auth?.getSession();

			if (!session?.user?.role) {
				return res.status(401).json({
					success: false,
					error: {
						message: "Unauthorized: No active session or role found.",
						code: "UNAUTHORIZED",
					},
				});
			}

			if (!allowedRoles.includes(session.user.role)) {
				return res.status(403).json({
					success: false,
					error: {
						message: "Forbidden: You do not have access to this resource.",
						code: "FORBIDDEN",
					},
				});
			}

			next();
		} catch (error) {
			if (req.log) {
				req.log.error("RBAC check failed", { error });
			} else {
				console.error("RBAC check failed", { error });
			}
			return res.status(500).json({
				success: false,
				error: {
					message: "Internal Server Error during authorization check.",
					code: "INTERNAL_SERVER_ERROR",
				},
			});
		}
	};

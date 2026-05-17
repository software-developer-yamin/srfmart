import { User } from "@srfmart/db/models/auth.model";
import { Transaction } from "@srfmart/db/models/transaction.model";
import { type Request, type Response, Router } from "express";
import mongoose from "mongoose";
import { requireRole } from "../lib/require-role";
import { idempotencyMiddleware } from "../middleware/idempotency";

const router = Router();

router.post(
	"/mint",
	[requireRole(["admin"]), idempotencyMiddleware],
	async (req: Request, res: Response) => {
		try {
			const { amount } = req.body;

			if (typeof amount !== "number" || amount <= 0) {
				return res.status(400).json({
					success: false,
					message: "Amount must be a positive number greater than zero",
				});
			}

			const sessionData = await req.auth?.getSession();
			const adminUserId = sessionData?.user?.id;

			if (!adminUserId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Could not determine user ID",
				});
			}

			const idempotencyKey = req.header("Idempotency-Key");

			const session = await mongoose.startSession();
			let success = false;

			try {
				await session.withTransaction(async () => {
					// 1. Create Transaction Document
					await Transaction.create(
						[
							{
								type: "MINT",
								receiverId: adminUserId,
								amount,
								status: "COMPLETED",
								idempotencyKey,
							},
						],
						{ session }
					);

					// 2. Update Admin (User) Document
					const updatedUser = await User.findByIdAndUpdate(
						adminUserId,
						{ $inc: { availableBalance: amount } },
						{ session, new: true }
					);

					if (!updatedUser) {
						throw new Error("Target admin user not found for balance update");
					}
					success = true;
				});
			} catch (err) {
				req.log?.error("Minting transaction aborted", { error: err });
				throw err; // Re-throw to be caught by outer catch block
			} finally {
				await session.endSession();
			}

			if (success) {
				req.log?.info(`Minted ${amount} points to admin ${adminUserId}`, {
					amount,
					adminUserId,
					idempotencyKey,
				});

				return res.status(200).json({
					success: true,
					message: `Successfully minted ${amount} points`,
				});
			}
		} catch (error: unknown) {
			req.log?.error("Internal server error during minting", { error });
			return res.status(500).json({
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Internal server error during minting",
			});
		}
	}
);

export const transactionRoutes = router;

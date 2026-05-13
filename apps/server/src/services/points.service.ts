import { User } from "@srfmart/db/models/auth.model";
import { Transaction } from "@srfmart/db/models/transaction.model";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

/**
 * Points management services.
 */
export const PointsService = {
	/**
	 * Distributes points equally among all users.
	 * Any remaining points are returned to the admin's account.
	 * @param adminId The ID of the admin performing the distribution
	 * @param totalPoints The total points to be distributed
	 * @param dailyLimit Optional daily limit to set for users
	 */
	async distributeGlobalPoints(
		adminId: string,
		totalPoints: number,
		dailyLimit?: number
	) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const users = await User.find({ role: "user" }).session(session);
			const userCount = users.length;

			if (userCount === 0) {
				throw new Error("No users found for distribution");
			}

			const pointsPerUser = Math.floor(totalPoints / userCount);
			const remainder = totalPoints % userCount;
			const idempotencyKey = uuidv4();

			// 1. Create the distribution transaction record
			await Transaction.create(
				[
					{
						type: "DISTRIBUTE",
						receiverId: adminId, // Admin is the source/controller
						amount: totalPoints,
						status: "COMPLETED",
						idempotencyKey,
						metadata: {
							pointsPerUser,
							remainder,
							userCount,
							dailyLimit,
						},
					},
				],
				{ session }
			);

			// 2. Update all users' balances
			await User.updateMany(
				{ role: "user" },
				{
					$inc: { availableBalance: pointsPerUser },
					...(dailyLimit === undefined ? {} : { dailyLimit }),
				}
			).session(session);

			// 3. Return remainder to admin
			if (remainder > 0) {
				await User.findByIdAndUpdate(adminId, {
					$inc: { availableBalance: remainder },
				}).session(session);
			}

			await session.commitTransaction();
			return {
				success: true,
				pointsPerUser,
				remainder,
				userCount,
			};
		} catch (error) {
			await session.abortTransaction();
			throw error;
		} finally {
			session.endSession();
		}
	},

	/**
	 * Transfers points from a user to an admin or moderator.
	 */
	async transferToStaff(senderId: string, receiverId: string, amount: number) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const sender = await User.findById(senderId).session(session);
			const receiver = await User.findById(receiverId).session(session);

			if (!(sender && receiver)) {
				throw new Error("Sender or receiver not found");
			}

			if (receiver.role !== "admin" && receiver.role !== "moderator") {
				throw new Error("Points can only be transferred to Admin or Moderator");
			}

			if (sender.availableBalance < amount) {
				throw new Error("Insufficient balance");
			}

			const idempotencyKey = uuidv4();

			// 1. Create Transaction
			await Transaction.create(
				[
					{
						type: "TRANSFER",
						senderId,
						receiverId,
						amount,
						status: "COMPLETED",
						idempotencyKey,
					},
				],
				{ session }
			);

			// 2. Update Balances
			await User.findByIdAndUpdate(senderId, {
				$inc: { availableBalance: -amount },
			}).session(session);

			await User.findByIdAndUpdate(receiverId, {
				$inc: { availableBalance: amount },
			}).session(session);

			await session.commitTransaction();
			return { success: true, idempotencyKey };
		} catch (error) {
			await session.abortTransaction();
			throw error;
		} finally {
			session.endSession();
		}
	},
};

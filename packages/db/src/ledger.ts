import mongoose from "mongoose";
import { User } from "./models/auth.model";
import { Transaction } from "./models/transaction.model";

export type TransactionType =
	| "MINT"
	| "TRANSFER"
	| "WITHDRAW_ESCROW"
	| "REFUND"
	| "DISTRIBUTE"
	| "BURN";

export interface LedgerOperation {
	amount: number;
	idempotencyKey: string;
	metadata?: Record<string, string | number | boolean | null | object>;
	receiverId?: string;
	senderId?: string;
	type: TransactionType;
}

/**
 * Executes an atomic point movement between users or system operations.
 * Implements AD1 (Atomic Transactions) and AD4 (Idempotency).
 */
export async function executeLedgerOperation(
	operation: LedgerOperation
): Promise<unknown> {
	const { type, amount, senderId, receiverId, idempotencyKey, metadata } =
		operation;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// 1. Check for existing transaction (Idempotency AD4)
		const existingTx = await Transaction.findOne({ idempotencyKey }).session(
			session
		);
		if (existingTx) {
			await session.abortTransaction();
			session.endSession();
			return existingTx;
		}

		// 2. Perform validations based on type
		if (type === "TRANSFER" || type === "WITHDRAW_ESCROW" || type === "BURN") {
			if (!senderId) {
				throw new Error(`senderId is required for ${type}`);
			}

			const sender = await User.findById(senderId).session(session);
			if (!sender) {
				throw new Error("Sender not found");
			}

			if (sender.availableBalance < amount) {
				throw new Error("Insufficient balance");
			}

			// Deduct from sender
			await User.findByIdAndUpdate(
				senderId,
				{ $inc: { availableBalance: -amount } },
				{ session }
			);
		}

		if (
			type === "TRANSFER" ||
			type === "MINT" ||
			type === "DISTRIBUTE" ||
			type === "REFUND"
		) {
			if (!receiverId) {
				throw new Error(`receiverId is required for ${type}`);
			}

			const receiver = await User.findById(receiverId).session(session);
			if (!receiver) {
				throw new Error("Receiver not found");
			}

			// Credit to receiver
			await User.findByIdAndUpdate(
				receiverId,
				{ $inc: { availableBalance: amount } },
				{ session }
			);
		}

		// Handle specific ESCROW logic if needed in future stories
		// (e.g., moving to escrowBalance for WITHDRAW_ESCROW)

		// 3. Create Transaction Record (AD1)
		const tx = new Transaction({
			type,
			amount,
			senderId,
			receiverId,
			idempotencyKey,
			metadata,
			status: "COMPLETED",
		});

		await tx.save({ session });

		await session.commitTransaction();
		session.endSession();

		return tx;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
}

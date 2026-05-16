import mongoose from "mongoose";
import { User } from "./models/auth.model";
import { type ITransaction, Transaction } from "./models/transaction.model";

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
 * Internal helper to apply point deductions (debits).
 */
async function applyDebit(
	session: mongoose.ClientSession,
	type: TransactionType,
	senderId: string,
	amount: number
) {
	const result = await User.findOneAndUpdate(
		{ _id: senderId, availableBalance: { $gte: amount } },
		{
			$inc: {
				availableBalance: -amount,
				...(type === "WITHDRAW_ESCROW" ? { escrowBalance: amount } : {}),
			},
		},
		{ session, new: true }
	);

	if (!result) {
		throw new Error("Insufficient balance or sender not found");
	}
}

/**
 * Internal helper to apply point additions (credits).
 */
async function applyCredit(
	session: mongoose.ClientSession,
	type: TransactionType,
	receiverId: string,
	amount: number,
	metadata?: Record<string, unknown>
) {
	const result = await User.findByIdAndUpdate(
		receiverId,
		{
			$inc: {
				availableBalance: amount,
				...(type === "REFUND" && metadata?.fromEscrow
					? { escrowBalance: -amount }
					: {}),
			},
		},
		{ session }
	);

	if (!result) {
		throw new Error("Receiver not found");
	}
}

/**
 * Executes an atomic point movement between users or system operations.
 * Implements AD1 (Atomic Transactions) and AD4 (Idempotency).
 */
export async function executeLedgerOperation(
	operation: LedgerOperation
): Promise<ITransaction> {
	const { type, amount, senderId, receiverId, idempotencyKey, metadata } =
		operation;

	if (amount <= 0) {
		throw new Error("Amount must be positive");
	}

	const session = await mongoose.startSession();

	try {
		const result = await session.withTransaction(async () => {
			// 1. Perform balance movements based on type
			if (
				type === "TRANSFER" ||
				type === "WITHDRAW_ESCROW" ||
				type === "BURN"
			) {
				if (!senderId) {
					throw new Error(`senderId is required for ${type}`);
				}
				await applyDebit(session, type, senderId, amount);
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
				await applyCredit(
					session,
					type,
					receiverId,
					amount,
					metadata as Record<string, unknown>
				);
			}

			// 2. Create Transaction Record (AD1)
			const [tx] = await Transaction.create(
				[
					{
						type,
						amount,
						senderId,
						receiverId,
						idempotencyKey,
						metadata,
						status: "COMPLETED",
					},
				],
				{ session }
			);

			return tx;
		});

		return result as ITransaction;
	} catch (error: unknown) {
		// Handle Idempotency (AD4) via unique index error
		if (
			error &&
			typeof error === "object" &&
			("code" in error || "message" in error)
		) {
			const err = error as { code?: number; message?: string };
			if (err.code === 11_000 || err.message?.includes("duplicate key")) {
				const existingTx = await Transaction.findOne({ idempotencyKey });
				if (existingTx) {
					return existingTx as ITransaction;
				}
			}
		}
		throw error;
	} finally {
		await session.endSession();
	}
}

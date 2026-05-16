import mongoose from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeLedgerOperation } from "./ledger";
import { User } from "./models/auth.model";
import { Transaction } from "./models/transaction.model";

// Mock dependencies
vi.mock("mongoose", async () => {
	const actual = await vi.importActual("mongoose");
	return {
		...actual,
		default: {
			...actual.default,
			startSession: vi.fn(),
		},
	};
});

vi.mock("./models/auth.model", () => ({
	User: {
		findOneAndUpdate: vi.fn(),
		findByIdAndUpdate: vi.fn(),
	},
}));

vi.mock("./models/transaction.model", () => ({
	Transaction: {
		create: vi.fn(),
		findOne: vi.fn(),
	},
}));

describe("Ledger Logic Verification", () => {
	let mockSession: any;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock Mongoose Session
		mockSession = {
			withTransaction: vi.fn((fn) => fn()),
			endSession: vi.fn(),
		};
		(mongoose.startSession as any).mockResolvedValue(mockSession);
	});

	it("should execute a successful TRANSFER atomically", async () => {
		const op = {
			type: "TRANSFER" as const,
			amount: 100,
			senderId: "sender-1",
			receiverId: "receiver-1",
			idempotencyKey: "key-1",
		} as const;

		// Mock success for balance updates
		(User.findOneAndUpdate as any).mockResolvedValue({ _id: "sender-1" });
		(User.findByIdAndUpdate as any).mockResolvedValue({ _id: "receiver-1" });
		(Transaction.create as any).mockResolvedValue([
			{ ...op, status: "COMPLETED" },
		]);

		const result = await executeLedgerOperation(op as any);

		// Verify atomicity (withTransaction was called)
		expect(mockSession.withTransaction).toHaveBeenCalled();

		// Verify Debit (Sender)
		expect(User.findOneAndUpdate).toHaveBeenCalledWith(
			{ _id: "sender-1", availableBalance: { $gte: 100 } },
			expect.objectContaining({ $inc: { availableBalance: -100 } }),
			expect.any(Object)
		);

		// Verify Credit (Receiver)
		expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
			"receiver-1",
			expect.objectContaining({ $inc: { availableBalance: 100 } }),
			expect.any(Object)
		);

		expect(result.status).toBe("COMPLETED");
	});

	it("should handle WITHDRAW_ESCROW by moving funds to escrowBalance", async () => {
		const op = {
			type: "WITHDRAW_ESCROW" as const,
			amount: 50,
			senderId: "user-1",
			idempotencyKey: "key-2",
		} as const;

		(User.findOneAndUpdate as any).mockResolvedValue({ _id: "user-1" });
		(Transaction.create as any).mockResolvedValue([
			{ ...op, status: "COMPLETED" },
		]);

		await executeLedgerOperation(op as any);

		// Verify double-entry logic: decrement available, increment escrow
		expect(User.findOneAndUpdate).toHaveBeenCalledWith(
			{ _id: "user-1", availableBalance: { $gte: 50 } },
			{ $inc: { availableBalance: -50, escrowBalance: 50 } },
			expect.any(Object)
		);
	});

	it("should handle idempotency by returning existing transaction on duplicate key", async () => {
		const op = {
			type: "MINT" as const,
			amount: 1000,
			receiverId: "admin-1",
			idempotencyKey: "dup-key",
		} as const;

		// Simulate duplicate key error (code 11000)
		const duplicateError = new Error("Duplicate key");
		(duplicateError as any).code = 11_000;
		mockSession.withTransaction.mockRejectedValue(duplicateError);

		// Mock existing transaction lookup
		const existingTx = { ...op, status: "COMPLETED", createdAt: new Date() };
		(Transaction.findOne as any).mockResolvedValue(existingTx);

		const result = await executeLedgerOperation(op as any);

		expect(Transaction.findOne).toHaveBeenCalledWith({
			idempotencyKey: "dup-key",
		});
		expect(result).toEqual(existingTx);
	});

	it("should fail if sender has insufficient balance", async () => {
		const op = {
			type: "TRANSFER" as const,
			amount: 1_000_000,
			senderId: "poor-user",
			receiverId: "receiver",
			idempotencyKey: "fail-key",
		} as const;

		// User.findOneAndUpdate returns null if filter doesn't match (insufficient balance)
		(User.findOneAndUpdate as any).mockResolvedValue(null);

		await expect(executeLedgerOperation(op as any)).rejects.toThrow(
			"Insufficient balance or sender not found"
		);
	});
});

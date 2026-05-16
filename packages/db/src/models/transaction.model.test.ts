import { describe, expect, it } from "vitest";
import { Transaction } from "./transaction.model";

describe("Transaction Model", () => {
	it("should validate a valid transaction", async () => {
		const tx = new Transaction({
			type: "TRANSFER",
			senderId: "user-1",
			receiverId: "user-2",
			amount: 100,
			status: "COMPLETED",
			idempotencyKey: "unique-key-1",
		});

		const error = await tx.validate();
		expect(error).toBeUndefined();
	});

	it("should fail if type is invalid", async () => {
		const tx = new Transaction({
			type: "INVALID_TYPE",
			senderId: "user-1",
			receiverId: "user-2",
			amount: 100,
			idempotencyKey: "unique-key-2",
		});

		let error: any;
		try {
			await tx.validate();
		} catch (e) {
			error = e;
		}
		expect(error).toBeDefined();
		expect(error.errors.type).toBeDefined();
	});

	it("should require senderId for TRANSFER", async () => {
		const tx = new Transaction({
			type: "TRANSFER",
			receiverId: "user-2",
			amount: 100,
			idempotencyKey: "unique-key-3",
		});

		let error: any;
		try {
			await tx.validate();
		} catch (e) {
			error = e;
		}
		expect(error).toBeDefined();
		expect(error.errors.senderId).toBeDefined();
	});

	it("should NOT require senderId for MINT", async () => {
		const tx = new Transaction({
			type: "MINT",
			receiverId: "user-2",
			amount: 100,
			idempotencyKey: "unique-key-4",
		});

		const error = await tx.validate();
		expect(error).toBeUndefined();
	});

	it("should NOT require receiverId for BURN", async () => {
		const tx = new Transaction({
			type: "BURN",
			senderId: "user-1",
			amount: 100,
			idempotencyKey: "unique-key-5",
		});

		const error = await tx.validate();
		expect(error).toBeUndefined();
	});

	it("should fail if idempotencyKey is missing", async () => {
		const tx = new Transaction({
			type: "TRANSFER",
			senderId: "user-1",
			receiverId: "user-2",
			amount: 100,
		});

		let error: any;
		try {
			await tx.validate();
		} catch (e) {
			error = e;
		}
		expect(error).toBeDefined();
		expect(error.errors.idempotencyKey).toBeDefined();
	});
});

import { Transaction } from "../models/transaction.model.ts";

async function testTransaction() {
	try {
		console.log("Testing Transaction model validation...");

		// Valid MINT transaction
		const mintTx = new Transaction({
			type: "MINT",
			receiverId: "admin-1",
			amount: 1000,
		});
		await mintTx.validate();
		console.log("✅ MINT validation passed");

		// Valid TRANSFER transaction
		const transferTx = new Transaction({
			type: "TRANSFER",
			senderId: "user-1",
			receiverId: "mod-1",
			amount: 50,
			idempotencyKey: "key-123",
		});
		await transferTx.validate();
		console.log("✅ TRANSFER validation passed");

		// Invalid transaction (missing amount)
		try {
			const invalidTx = new Transaction({
				type: "TRANSFER",
				senderId: "user-1",
				receiverId: "mod-1",
			});
			await invalidTx.validate();
			console.error(
				"❌ FAIL: Validation should have failed for missing amount"
			);
			process.exit(1);
		} catch {
			console.log("✅ Validation correctly failed for missing amount");
		}

		console.log("SUCCESS: Transaction model behaves as expected.");
		process.exit(0);
	} catch (error) {
		console.error("FAIL: Error testing transaction model", error);
		process.exit(1);
	}
}

testTransaction();

import { User } from "../models/auth.model.ts";

function testSchema() {
	try {
		const user = new User({
			_id: "test-id",
			name: "Test User",
			email: "test@example.com",
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const role = (user as any).role;
		const availableBalance = (user as any).availableBalance;
		const escrowBalance = (user as any).escrowBalance;

		console.log("Checking fields...");
		console.log(`Role: ${role} (Expected: user)`);
		console.log(`Available Balance: ${availableBalance} (Expected: 0)`);
		console.log(`Escrow Balance: ${escrowBalance} (Expected: 0)`);

		if (role !== "user" || availableBalance !== 0 || escrowBalance !== 0) {
			console.error(
				"FAIL: Missing or incorrect default values for new fields."
			);
			process.exit(1);
		}

		console.log("SUCCESS: Schema fields found with correct defaults.");
		process.exit(0);
	} catch (error) {
		console.error("FAIL: Error testing schema", error);
		process.exit(1);
	}
}

testSchema();

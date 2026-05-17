import crypto from "node:crypto";
import { Account, User } from "@srfmart/db";
import { hashPassword } from "better-auth/crypto";

async function seedAdmin() {
	const email = "admin@email.com";
	const password = "12345678";

	const existing = await User.findOne({ email }).lean();
	if (existing) {
		console.log("Admin account already exists:", existing.email);
		console.log("Role:", existing.role);
		console.log("Referral code:", existing.referralCode);
		process.exit(0);
	}

	const userId = crypto.randomUUID();
	const referralCode = `ADMIN-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
	const hashedPassword = await hashPassword(password);
	const now = new Date();

	await User.create({
		_id: userId,
		name: "Admin",
		email,
		emailVerified: true,
		role: "admin",
		referralCode,
		availableBalance: 0,
		escrowBalance: 0,
		createdAt: now,
		updatedAt: now,
	});

	await Account.create({
		_id: crypto.randomUUID(),
		accountId: userId,
		providerId: "credential",
		userId,
		password: hashedPassword,
		createdAt: now,
		updatedAt: now,
	});

	console.log("Admin account created successfully!");
	console.log("Email:", email);
	console.log("Password:", password);
	console.log("Role: admin");
	console.log("Referral code:", referralCode);
	console.log("User ID:", userId);

	process.exit(0);
}

seedAdmin().catch((error) => {
	console.error("Failed to seed admin:", error);
	process.exit(1);
});

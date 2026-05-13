import mongoose from "mongoose";

const { Schema, model } = mongoose;

interface ITransaction {
	amount: number;
	idempotencyKey?: string;
	metadata?: Record<string, unknown>;
	receiverId?: string;
	senderId?: string;
	status: string;
	type: string;
}

const transactionSchema = new Schema<ITransaction>(
	{
		type: {
			type: String,
			enum: [
				"MINT",
				"TRANSFER",
				"WITHDRAW_ESCROW",
				"REFUND",
				"DISTRIBUTE",
				"BURN",
			],
			required: true,
		},
		senderId: {
			type: String,
			ref: "User",
			required() {
				return this.type !== "MINT";
			},
		},
		receiverId: {
			type: String,
			ref: "User",
			required() {
				return this.type !== "BURN";
			},
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: ["PENDING", "COMPLETED", "FAILED"],
			default: "COMPLETED",
		},
		idempotencyKey: {
			type: String,
			unique: true,
			sparse: true,
		},
		metadata: {
			type: Schema.Types.Mixed,
		},
	},
	{
		timestamps: true,
		collection: "transaction",
	}
);

const Transaction = model("Transaction", transactionSchema);

export { Transaction };

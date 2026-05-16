import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface ITransaction extends mongoose.Document {
	amount: number; // Stored as integer (cents/units)
	idempotencyKey: string;
	metadata?: Record<string, string | number | boolean | null | object>;
	receiverId?: string;
	senderId?: string;
	status: "PENDING" | "COMPLETED" | "FAILED";
	type:
		| "MINT"
		| "TRANSFER"
		| "WITHDRAW_ESCROW"
		| "REFUND"
		| "DISTRIBUTE"
		| "BURN";
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
			required(this: ITransaction) {
				return (
					this.type !== "MINT" &&
					this.type !== "DISTRIBUTE" &&
					this.type !== "REFUND"
				);
			},
		},
		receiverId: {
			type: String,
			ref: "User",
			required(this: ITransaction) {
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
			default: "PENDING",
		},
		idempotencyKey: {
			type: String,
			unique: true,
			sparse: true,
			required: true,
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

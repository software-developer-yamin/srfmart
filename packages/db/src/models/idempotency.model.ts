import { type Document, model, Schema } from "mongoose";

export interface IIdempotency extends Document {
	createdAt: Date;
	key: string;
	response: unknown;
	statusCode: number;
}

export const idempotencySchema = new Schema<IIdempotency>(
	{
		key: {
			type: String,
			unique: true,
			required: true,
			index: true,
		},
		response: {
			type: Schema.Types.Mixed,
		},
		statusCode: {
			type: Number,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			expires: 86_400, // 24 hours in seconds
		},
	},
	{
		versionKey: false,
	}
);

export const Idempotency = model<IIdempotency>(
	"Idempotency",
	idempotencySchema
);

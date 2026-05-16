import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Idempotency } from "../models/idempotency.model";

const KEY_REQUIRED_REGEX = /Path `key` is required/;
const STATUS_CODE_REQUIRED_REGEX = /Path `statusCode` is required/;

describe("Idempotency Model", () => {
	beforeAll(async () => {
		// Attempting to connect to the test db instance
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(
				process.env.DATABASE_URL ||
					"mongodb://root:password@localhost:27017/srfmart?authSource=admin"
			);
		}
	});

	afterAll(async () => {
		if (mongoose.connection.readyState !== 0) {
			await Idempotency.deleteMany({});
			await mongoose.disconnect();
		}
	});

	it("should create an idempotency record successfully", async () => {
		const record = new Idempotency({
			key: "test-idempotency-key-1",
			statusCode: 200,
			response: { success: true, points: 100 },
		});

		await record.validate();

		expect(record).toBeDefined();
		expect(record.key).toBe("test-idempotency-key-1");
		expect(record.statusCode).toBe(200);
		expect(record.response).toEqual({ success: true, points: 100 });
		expect(record.createdAt).toBeInstanceOf(Date);
	});

	it("should require a key", async () => {
		const record = new Idempotency({
			statusCode: 200,
			response: {},
		});

		await expect(record.validate()).rejects.toThrow(KEY_REQUIRED_REGEX);
	});

	it("should require a statusCode", async () => {
		const record = new Idempotency({
			key: "test-key-no-status",
			response: {},
		});

		await expect(record.validate()).rejects.toThrow(STATUS_CODE_REQUIRED_REGEX);
	});
});

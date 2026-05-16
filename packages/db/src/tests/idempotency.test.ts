import { describe, expect, it } from "vitest";
import { Idempotency, idempotencySchema } from "../models/idempotency.model";

describe("Idempotency Model", () => {
	it("should have correct model name", () => {
		expect(Idempotency.modelName).toBe("Idempotency");
	});

	it("should define key field as unique and required", () => {
		const keyConfig = idempotencySchema.path("key");
		expect(keyConfig.options.required).toBe(true);
		expect(keyConfig.options.unique).toBe(true);
	});

	it("should define TTL index on createdAt for 24 hours (86400 seconds)", () => {
		const createdAtConfig = idempotencySchema.path("createdAt");
		// In mongoose, `expires` acts as the TTL indicator on the field schema option
		expect(createdAtConfig.options.expires).toBe(86_400);
	});
});

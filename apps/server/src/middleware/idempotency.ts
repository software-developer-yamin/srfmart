import { Idempotency } from "@srfmart/db";
import type { NextFunction, Request, Response } from "express";

export const idempotencyMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const idempotencyKey = req.headers["idempotency-key"] as string | undefined;

	// 1. If no header is provided on mutating endpoints, reject immediately
	if (!idempotencyKey) {
		res.status(400).json({
			error: "Idempotency-Key header is required for this operation",
		});
		return;
	}

	try {
		// 2. Check if the key already exists
		const existingRecord = await Idempotency.findOne({ key: idempotencyKey });

		if (existingRecord) {
			// Return cached response safely avoiding 500 status loop
			res.status(existingRecord.statusCode).json(existingRecord.response);
			return;
		}

		// Capture the original response methods
		const originalJson = res.json.bind(res);
		const originalSend = res.send.bind(res);
		let capturedBody: unknown;

		// Override res.json to capture the response body
		res.json = (body: unknown) => {
			capturedBody = body;
			return originalJson(body);
		};

		// Override res.send to capture the response body if it wasn't intercepted by json()
		res.send = (body: unknown) => {
			if (capturedBody === undefined) {
				try {
					capturedBody = typeof body === "string" ? JSON.parse(body) : body;
				} catch {
					capturedBody = body;
				}
			}
			return originalSend(body);
		};

		// 3. Listen for response finish to save the idempotency record
		res.on("finish", async () => {
			const statusCode = res.statusCode;

			// Only cache 2xx successes and deterministic 4xx client errors.
			// Do NOT cache 5xx server errors because retries might succeed later.
			if (statusCode >= 200 && statusCode < 500 && capturedBody !== undefined) {
				try {
					await Idempotency.create({
						key: idempotencyKey,
						statusCode,
						response: capturedBody,
					});
				} catch (error: unknown) {
					// If we hit a duplicate key error here, it means a concurrent request
					// with the same key slipped through the initial findOne check.
					// This is a rare race condition, but it's handled gracefully because
					// the Mongoose model guarantees uniqueness.
					const err = error as { code?: number };
					if (err.code !== 11_000) {
						console.error("Failed to save idempotency record:", error);
					}
				}
			}
		});

		next();
	} catch (error) {
		console.error("Idempotency middleware error:", error);
		next(error);
	}
};

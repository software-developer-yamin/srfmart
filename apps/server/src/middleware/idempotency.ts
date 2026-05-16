import { Idempotency } from "@srfmart/db/models/idempotency.model";
import type { NextFunction, Request, Response } from "express";

export const idempotencyMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const idempotencyKey = req.header("Idempotency-Key");

	if (!idempotencyKey) {
		res.status(400).json({
			success: false,
			message: "Idempotency-Key header is required",
		});
		return;
	}

	try {
		// Check if key already exists
		const existingKey = await Idempotency.findOne({ key: idempotencyKey });

		if (existingKey) {
			// If we have a cached response, return it directly
			res.status(existingKey.statusCode).json(existingKey.response);
			return;
		}

		// Intercept the json response
		const originalJson = res.json.bind(res);

		res.json = (body: unknown): Response => {
			// Save to DB on successful or deterministic error responses (e.g. 400s)
			// Avoid caching 500s because a retry might succeed later
			if (res.statusCode < 500) {
				Idempotency.create({
					key: idempotencyKey,
					statusCode: res.statusCode,
					response: body,
				}).catch((err) => {
					console.error("Failed to save idempotency key:", err);
				});
			}

			// Call original json with context
			return originalJson(body);
		};

		next();
	} catch (error) {
		console.error("Idempotency middleware error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error during idempotency check",
		});
	}
};

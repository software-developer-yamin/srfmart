import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { requireRole } from "../src/lib/require-role";

describe("RBAC Middleware", () => {
	const createMockReq = (sessionValue: unknown) =>
		({
			headers: {},
			log: { error: vi.fn() },
			auth: {
				getSession: vi.fn().mockResolvedValue(sessionValue),
			},
		}) as unknown as Request;

	const createMockRes = () => {
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		} as unknown as Response;
		return res;
	};

	it("should return 401 if no session is found", async () => {
		const middleware = requireRole(["admin"]);
		const req = createMockReq(null);
		const res = createMockRes();
		const next = vi.fn() as NextFunction;

		await middleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				error: expect.objectContaining({ code: "UNAUTHORIZED" }),
			})
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("should return 403 if user role is not allowed", async () => {
		const middleware = requireRole(["admin"]);
		const req = createMockReq({
			user: { role: "user" },
		});
		const res = createMockRes();
		const next = vi.fn() as NextFunction;

		await middleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				error: expect.objectContaining({ code: "FORBIDDEN" }),
			})
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("should call next() if user role is allowed", async () => {
		const middleware = requireRole(["admin"]);
		const req = createMockReq({
			user: { role: "admin" },
		});
		const res = createMockRes();
		const next = vi.fn() as NextFunction;

		await middleware(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});

	it("should call next() if user has one of the allowed roles", async () => {
		const middleware = requireRole(["admin", "moderator"]);
		const req = createMockReq({
			user: { role: "moderator" },
		});
		const res = createMockRes();
		const next = vi.fn() as NextFunction;

		await middleware(req, res, next);

		expect(next).toHaveBeenCalled();
	});
});

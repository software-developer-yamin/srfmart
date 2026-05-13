import { describe, expect, it, vi } from "vitest";
import { requireRole } from "../src/lib/require-role";

describe("RBAC Middleware", () => {
	it("should return 401 if no session is found", async () => {
		const middleware = requireRole(["admin"]);
		const req = {
			headers: {},
			log: { error: vi.fn() },
			auth: {
				getSession: vi.fn().mockResolvedValue(null),
			},
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		};
		const next = vi.fn();

		await middleware(req as any, res as any, next);

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
		const req = {
			headers: {},
			log: { error: vi.fn() },
			auth: {
				getSession: vi.fn().mockResolvedValue({
					user: { role: "user" },
				}),
			},
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		};
		const next = vi.fn();

		await middleware(req as any, res as any, next);

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
		const req = {
			headers: {},
			log: { error: vi.fn() },
			auth: {
				getSession: vi.fn().mockResolvedValue({
					user: { role: "admin" },
				}),
			},
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		};
		const next = vi.fn();

		await middleware(req as any, res as any, next);

		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});

	it("should call next() if user has one of the allowed roles", async () => {
		const middleware = requireRole(["admin", "moderator"]);
		const req = {
			headers: {},
			log: { error: vi.fn() },
			auth: {
				getSession: vi.fn().mockResolvedValue({
					user: { role: "moderator" },
				}),
			},
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		};
		const next = vi.fn();

		await middleware(req as any, res as any, next);

		expect(next).toHaveBeenCalled();
	});
});

import { auth } from "@srfmart/auth";
import { env } from "@srfmart/env/server";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import { initLogger } from "evlog";
import { createAuthMiddleware } from "evlog/better-auth";
import { evlog } from "evlog/express";
import express from "express";
import { requireRole } from "./lib/require-role";
import { userRoutes } from "./routes/users";

initLogger({
	env: { service: "srfmart-server" },
});

const identifyUser = createAuthMiddleware(auth, {
	exclude: ["/api/auth/**"],
	maskEmail: true,
});

const app = express();

app.use(evlog());
app.use(async (req, _res, next) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		req.auth = {
			getSession: async () => session,
		};
		await identifyUser(req.log, req.headers, req.path);
		next();
	} catch (error) {
		next(error);
	}
});

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/users", userRoutes);

// Placeholder for protected routes to test RBAC
app.get("/api/admin/test", requireRole(["admin"]), (_req, res) => {
	res.status(200).json({ success: true, message: "Welcome Admin" });
});

app.get(
	"/api/moderator/test",
	requireRole(["admin", "moderator"]),
	(_req, res) => {
		res.status(200).json({ success: true, message: "Welcome Moderator/Admin" });
	}
);

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

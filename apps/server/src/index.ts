import { auth } from "@srfmart/auth";
import { env } from "@srfmart/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { initLogger } from "evlog";
import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";
import { evlog } from "evlog/express";
import express from "express";

initLogger({
  env: { service: "srfmart-server" },
});

const identifyUser = createAuthMiddleware(auth as BetterAuthInstance, {
  exclude: ["/api/auth/**"],
  maskEmail: true,
});

const app = express();

app.use(evlog());
app.use(async (req, _res, next) => {
  await identifyUser(req.log, req.headers, req.path);
  next();
});

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

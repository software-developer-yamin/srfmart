import { env } from "@srfmart/env/server";
import mongoose from "mongoose";

await mongoose.connect(env.DATABASE_URL).catch((error) => {
	console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db();

// biome-ignore lint/performance/noBarrelFile: Exporting models for internal package use
export { Account, Session, User, Verification } from "./models/auth.model";
export { Transaction } from "./models/transaction.model";
export { client };

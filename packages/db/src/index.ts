import { env } from "@srfmart/env/server";
import mongoose from "mongoose";

await mongoose.connect(env.DATABASE_URL).catch((error) => {
	console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db();

export { executeLedgerOperation } from "./ledger";
export { Account, Session, User, Verification } from "./models/auth.model";
export { Idempotency } from "./models/idempotency.model";
export { Transaction } from "./models/transaction.model";
export { client };

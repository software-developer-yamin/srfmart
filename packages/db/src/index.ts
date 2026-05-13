import { env } from "@srfmart/env/server";
import mongoose from "mongoose";

await mongoose.connect(env.DATABASE_URL).catch((error) => {
	console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db("myDB");

export { Account, Session, User, Verification } from "./models/auth.model.js";
export { Transaction } from "./models/transaction.model.js";
export { client };

import { env } from "@srfmart/env/server";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

let replSet: MongoMemoryReplSet | undefined;
let initPromise: Promise<MongoMemoryReplSet> | undefined;

export const connectReplicaSet = async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	// Address dangling promise / concurrency anomaly by locking initialization
	if (!replSet) {
		if (!initPromise) {
			initPromise = MongoMemoryReplSet.create({
				replSet: { count: 1, storageEngine: "wiredTiger" },
			});
		}
		replSet = await initPromise;
	}

	const uri = replSet.getUri();
	// Bypass standard initialization hook env variable via monkey patch
	Object.defineProperty(env, "DATABASE_URL", {
		value: uri,
		writable: true,
		configurable: true,
	});
	// Also set standard env for robust fallback handling
	process.env.DATABASE_URL = uri;

	if (mongoose.connection.readyState === 0) {
		await mongoose.connect(uri);
	}
};

export const disconnectReplicaSet = async () => {
	await mongoose.disconnect();

	// Unreset replica state block fix
	if (replSet) {
		await replSet.stop();
		replSet = undefined;
		initPromise = undefined;
	}
};

export const clearDatabase = async () => {
	// Efficient DB drop over iterative deleteMany({})
	if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
		await mongoose.connection.db.dropDatabase();
	}
};

import { env } from "@srfmart/env/server";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

let replSet: MongoMemoryReplSet;

export const connectReplicaSet = async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	// Prevent duplicate initialization
	if (!replSet) {
		replSet = await MongoMemoryReplSet.create({
			replSet: { count: 1, storageEngine: "wiredTiger" },
		});
	}

	const uri = replSet.getUri();
	// Bypass standard initialization hook env variable via monkey patch for safe isolated tests
	Object.defineProperty(env, "DATABASE_URL", {
		value: uri,
		writable: true,
		configurable: true,
	});
	await mongoose.connect(uri);
};

export const disconnectReplicaSet = async () => {
	await mongoose.disconnect();
	if (replSet) {
		await replSet.stop();
	}
};

export const clearDatabase = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		if (Object.hasOwn(collections, key)) {
			const collection = collections[key];
			if (collection) {
				await collection.deleteMany({});
			}
		}
	}
};

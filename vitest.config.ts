import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./vitest.setup.ts"],
		// Prevents massive DB resource exhaustion by disabling parallel per-file worker execution
		fileParallelism: false,
	},
});

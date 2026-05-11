// graphify OpenCode plugin
// Injects a knowledge graph reminder before bash tool calls when the graph exists.
import { existsSync } from "node:fs";
import { join } from "node:path";

export const GraphifyPlugin = ({ directory }) => {
	let reminded = false;

	return {
		"tool.execute.before": (input, output) => {
			if (reminded) {
				return;
			}
			if (!existsSync(join(directory, "graphify-out", "graph.json"))) {
				return;
			}

			if (input.tool === "bash") {
				output.args.command =
					'echo "[graphify] Knowledge graph available. Read graphify-out/GRAPH_REPORT.md for god nodes and architecture context before searching files." && ' +
					output.args.command;
				reminded = true;
			}
		},
	};
};

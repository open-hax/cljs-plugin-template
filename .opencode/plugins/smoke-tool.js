import { tool } from "@opencode-ai/plugin";

export const SmokeToolPlugin = async () => ({
  tool: {
    smokeTool: tool({
      description: "Returns the message it received along with a deterministic label for smoke tests.",
      args: {
        question: tool.schema.string().describe("The question or prompt to echo back"),
      },
      async execute({ question }) {
        return {
          status: "ok",
          question,
          label: "smoke-tool-response",
          timestamp: new Date().toISOString(),
        };
      },
    }),
  },
});

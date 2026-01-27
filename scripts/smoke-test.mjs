import { spawn } from "node:child_process";
import readline from "node:readline";

const toolName = "smokeTool";
const prompt = `This is a smoke test. Use the ${toolName} tool exactly once, pass { question: "smoke test" }, and echo the tool result back in your final answer.`;
const args = [
  "run",
  prompt,
  "--format",
  "json",
  "--print-logs",
];

console.log(`Starting smoke test: opencode ${args.join(" ")}`);

const child = spawn("opencode", args, { stdio: ["ignore", "pipe", "pipe"], env: process.env });
child.stderr.pipe(process.stderr);

const rl = readline.createInterface({ input: child.stdout });

let toolEvent = null;

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  console.error(`[smoke-test] ${trimmed}`);
  try {
    const event = JSON.parse(trimmed);
    const name = event?.event ?? event?.name ?? event?.type;
    const toolCandidate =
      event?.data?.tool?.id ?? event?.data?.tool?.name ?? event?.tool?.id ?? event?.tool?.name ?? event?.tool;
    if (name === "tool.execute.after" && toolCandidate === toolName) {
      toolEvent = event;
      console.error(`[smoke-test] detected ${name} for ${toolName}`);
    }
  } catch (error) {
    console.error(`[smoke-test] ignoring non-json line: ${error.message}`);
  }
});

const terminate = (code = 0) => {
  if (!child.killed && child.exitCode === null) {
    child.kill("SIGINT");
  }
  process.exit(code);
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => terminate(130));
});

child.on("error", (error) => {
  console.error("[smoke-test] failed to start opencode:", error.message);
  terminate(1);
});

child.on("close", (code) => {
  if (!toolEvent) {
    console.error("[smoke-test] no smokeTool execution detected in the JSON stream");
    terminate(code || 1);
    return;
  }

  console.log("[smoke-test] smokeTool execution detected, smoke test passed");
  terminate(0);
});

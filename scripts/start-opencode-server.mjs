import { spawn } from "node:child_process";

const port = process.env.OPENCODE_DEV_PORT ?? "4096";
const hostname = process.env.OPENCODE_DEV_HOSTNAME ?? "127.0.0.1";
const command = (process.env.OPENCODE_DEV_COMMAND ?? "opencode").trim() || "opencode";
const extraArgs = (process.env.OPENCODE_DEV_COMMAND_ARGS ?? "")
  .split(/\s+/)
  .filter(Boolean);
const args = [...extraArgs, "serve", "--hostname", hostname, "--port", port];

console.log(
  `[opencode] starting dev server (${command} ${args.join(" ")}) on ${hostname}:${port}`
);

const server = spawn(command, args, { stdio: "inherit", shell: false });

server.on("error", (error) => {
  console.error("[opencode] failed to start server:", error.message);
  process.exit(1);
});

let shuttingDown = false;

const exitServer = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exit(code);
};

server.on("exit", (code, signal) => {
  const exitCode = signal ? 1 : code ?? 0;
  console.log(`[opencode] server process exited with ${signal ?? exitCode}`);
  exitServer(exitCode);
});

const forwardSignal = (signal) => {
  if (server.exitCode !== null) {
    exitServer();
    return;
  }
  server.kill(signal);
};

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, () => forwardSignal(signal));
});

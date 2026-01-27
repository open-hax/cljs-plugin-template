import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distPlugin = path.join(root, "dist", "plugin.js");
const entryScript = path.join(root, "scripts", "start-opencode-server.mjs");

export default {
  apps: [
    {
      name: "opencode-dev-server",
      script: entryScript,
      autorestart: true,
      restart_delay: 2000,
      watch: [distPlugin],
      watch_delay: 1000,
      watch_options: {
        followSymlinks: false,
      },
      ignore_watch: ["node_modules", ".git", ".shadow-cljs"],
      env: {
        OPENCODE_DEV_PORT: 4096,
        OPENCODE_DEV_HOSTNAME: "127.0.0.1",
      },
    },
  ],
};

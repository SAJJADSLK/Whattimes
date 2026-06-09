import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  defineConfig,
  type Plugin,
  type ViteDevServer,
} from "vite";

import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Paths
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = __dirname;

const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");

const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);

type LogSource =
  | "browserConsole"
  | "networkRequests"
  | "sessionReplay";

// =============================================================================
// Log Helpers
// =============================================================================

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (
      !fs.existsSync(logPath) ||
      fs.statSync(logPath).size <= maxSize
    ) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");

    const keptLines: string[] = [];

    let keptBytes = 0;

    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(
        `${lines[i]}\n`,
        "utf-8"
      );

      if (keptBytes + lineBytes > TRIM_TARGET_BYTES) {
        break;
      }

      keptLines.unshift(lines[i]);

      keptBytes += lineBytes;
    }

    fs.writeFileSync(
      logPath,
      keptLines.join("\n"),
      "utf-8"
    );
  } catch {
    // Ignore log trim errors
  }
}

function writeToLogFile(
  source: LogSource,
  entries: unknown[]
) {
  if (!entries.length) return;

  ensureLogDir();

  const logPath = path.join(LOG_DIR, `${source}.log`);

  const lines = entries.map((entry) => {
    return `[${new Date().toISOString()}] ${JSON.stringify(entry)}`;
  });

  fs.appendFileSync(
    logPath,
    `${lines.join("\n")}\n`,
    "utf-8"
  );

  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

// =============================================================================
// Manus Debug Collector Plugin
// =============================================================================

function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    apply: "serve",

    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        "/__manus__/logs",
        (req, res, next) => {
          if (req.method !== "POST") {
            return next();
          }

          const handlePayload = (payload: any) => {
            if (payload.consoleLogs?.length) {
              writeToLogFile(
                "browserConsole",
                payload.consoleLogs
              );
            }

            if (payload.networkRequests?.length) {
              writeToLogFile(
                "networkRequests",
                payload.networkRequests
              );
            }

            if (payload.sessionEvents?.length) {
              writeToLogFile(
                "sessionReplay",
                payload.sessionEvents
              );
            }

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(
              JSON.stringify({
                success: true,
              })
            );
          };

          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", () => {
            try {
              const payload = JSON.parse(body);

              handlePayload(payload);
            } catch (e) {
              res.writeHead(400, {
                "Content-Type": "application/json",
              });

              res.end(
                JSON.stringify({
                  success: false,
                  error: String(e),
                })
              );
            }
          });
        }
      );
    },
  };
}

// =============================================================================
// Plugins
// =============================================================================

const plugins = [
  react(),
  tailwindcss(),
  vitePluginManusRuntime(),

  ...(process.env.NODE_ENV === "development"
    ? [vitePluginManusDebugCollector()]
    : []),
];

// =============================================================================
// Config
// =============================================================================

export default defineConfig({
  plugins,

  root: path.resolve(__dirname, "client"),

  publicDir: path.resolve(
    __dirname,
    "client/public"
  ),

  envDir: __dirname,

  resolve: {
    alias: {
      "@": path.resolve(
        __dirname,
        "client/src"
      ),

      "@shared": path.resolve(
        __dirname,
        "shared"
      ),

      "@assets": path.resolve(
        __dirname,
        "attached_assets"
      ),

      "@server": path.resolve(
        __dirname,
        "server"
      ),
    },
  },

  build: {
    outDir: path.resolve(__dirname, "dist"),

    emptyOutDir: true,

    sourcemap: false,

    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "@trpc/client",
            "@trpc/react-query",
          ],

          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs",
          ],

          utils: [
            "luxon",
            "date-fns",
            "nanoid",
          ],
        },
      },
    },
  },

  server: {
    host: true,

    port: 5173,

    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],

    fs: {
      strict: false,
    },
  },
});

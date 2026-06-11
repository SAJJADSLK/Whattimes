#!/usr/bin/env node
/**
 * Vercel Build Script
 * Builds Vite frontend and copies API functions to dist/api
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("[BUILD] Starting Vercel build process...");

// Build frontend (Vite handles transpilation, no tsc needed)
console.log("[BUILD] Building frontend...");
try {
  execSync("npx vite build", {   // ✅ call vite directly, bypasses any tsc in npm run build
    cwd: __dirname,
    stdio: "inherit",
    env: {
      ...process.env,
      SKIP_ENV_VALIDATION: "1",  // skip any env checks during build
    },
  });
  console.log("[BUILD] ✓ Frontend build complete");
} catch (error) {
  console.error("[BUILD] ✗ Frontend build failed");
  process.exit(1);
}

const apiSrcDir = path.join(__dirname, "api");
const apiDistDir = path.join(__dirname, "dist", "api");

// Create dist/api
fs.mkdirSync(apiDistDir, { recursive: true });

// Copy API folder recursively
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
    console.log(`[BUILD] Copied: ${path.relative(__dirname, src)}`);
  }
}

if (fs.existsSync(apiSrcDir)) {
  console.log("[BUILD] Copying API functions...");
  copyRecursive(apiSrcDir, apiDistDir);
  console.log("[BUILD] ✓ API copied");
} else {
  console.warn("[BUILD] No api directory found");
}

console.log("[BUILD] ✓ Build complete");
console.log("[BUILD] Output: dist/");

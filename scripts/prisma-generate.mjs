/**
 * Cross-platform Prisma generate with Windows EBUSY retry + .tmp copy fallback.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "node_modules", ".prisma", "client");
const engineFile = path.join(clientDir, "query_engine-windows.dll.node");
const maxRetries = 5;
const retryDelayMs = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function removeStaleTmpEngines() {
  if (!fs.existsSync(clientDir)) return;
  for (const name of fs.readdirSync(clientDir)) {
    if (!name.startsWith("query_engine-windows.dll.node.tmp")) continue;
    try {
      fs.unlinkSync(path.join(clientDir, name));
      console.log(`Removed stale temp engine: ${name}`);
    } catch {
      // ignore — file may be locked
    }
  }
}

function copyLatestTmpEngine() {
  if (!fs.existsSync(clientDir)) return false;

  const tmpFiles = fs
    .readdirSync(clientDir)
    .filter((name) => name.startsWith("query_engine-windows.dll.node.tmp"))
    .map((name) => {
      const fullPath = path.join(clientDir, name);
      return { name, fullPath, mtime: fs.statSync(fullPath).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (tmpFiles.length === 0) return false;

  try {
    fs.copyFileSync(tmpFiles[0].fullPath, engineFile);
    console.log(`Copied ${tmpFiles[0].name} -> query_engine-windows.dll.node`);
    removeStaleTmpEngines();
    return true;
  } catch (error) {
    console.warn("Manual copy failed:", error);
    return false;
  }
}

function runPrismaGenerate() {
  const result = spawnSync("npx", ["prisma", "generate"], {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (output.trim()) process.stdout.write(output);

  return { code: result.status ?? 1, output };
}

async function main() {
  console.log("Prisma generate (safe)...");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    removeStaleTmpEngines();
    console.log(`Attempt ${attempt} of ${maxRetries}...`);

    const { code, output } = runPrismaGenerate();
    if (code === 0) {
      removeStaleTmpEngines();
      console.log("Prisma client generated successfully.");
      process.exit(0);
    }

    if (output.includes("EBUSY")) {
      console.warn(
        `Engine file locked (EBUSY). Retrying in ${retryDelayMs / 1000}s...`,
      );
      console.warn(
        "Tip: stop 'npm run dev', Prisma Studio, and other terminals using this project.",
      );
      await sleep(retryDelayMs);

      if (attempt === maxRetries && copyLatestTmpEngine()) {
        console.log("Prisma engine restored via .tmp copy workaround.");
        process.exit(0);
      }
      continue;
    }

    process.exit(code);
  }

  console.error("\nPrisma generate failed after all retries.");
  console.error("1. Stop all dev servers (npm run dev)");
  console.error("2. Close Prisma Studio");
  console.error("3. Run: npm run db:generate");
  console.error("4. Restart Cursor/VS Code if the lock persists");
  process.exit(1);
}

main();

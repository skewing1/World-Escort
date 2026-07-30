/**
 * Prisma generate wrapper (retries on transient Windows EBUSY locks).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const enginesDir = path.join(root, "node_modules", "@prisma", "engines");
const maxRetries = 5;
const retryDelayMs = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function repairSchemaEngine() {
  if (!fs.existsSync(enginesDir)) return;

  const target = path.join(enginesDir, "schema-engine-windows.exe");
  const tmpFiles = fs
    .readdirSync(enginesDir)
    .filter((name) => name.startsWith("schema-engine-windows.exe.tmp"))
    .map((name) => {
      const fullPath = path.join(enginesDir, name);
      return { name, fullPath, mtime: fs.statSync(fullPath).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (tmpFiles.length > 0 && !fs.existsSync(target)) {
    try {
      fs.copyFileSync(tmpFiles[0].fullPath, target);
      console.log(`Restored schema-engine from ${tmpFiles[0].name}`);
    } catch {
      // ignore
    }
  }

  for (const file of tmpFiles) {
    try {
      fs.unlinkSync(file.fullPath);
    } catch {
      // ignore locked temp files
    }
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
  console.log("Prisma generate...");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    repairSchemaEngine();
    console.log(`Attempt ${attempt} of ${maxRetries}...`);

    const { code, output } = runPrismaGenerate();
    if (code === 0) {
      repairSchemaEngine();
      console.log("Prisma client generated successfully.");
      process.exit(0);
    }

    if (output.includes("EBUSY") && attempt < maxRetries) {
      console.warn(`Generate failed (EBUSY). Retrying in ${retryDelayMs / 1000}s...`);
      await sleep(retryDelayMs);
      continue;
    }

    process.exit(code);
  }
}

main();

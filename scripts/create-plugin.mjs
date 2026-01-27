import fs from "node:fs";
import path from "node:path";

const [, , name] = process.argv;

if (!name) {
  console.error("Usage: pnpm create <plugin-name>");
  process.exit(1);
}

const root = process.cwd();
const tplDir = path.join(root, "template");
const outDir = path.join(root, name);

if (!fs.existsSync(tplDir)) {
  console.error("Missing template directory:", tplDir);
  process.exit(1);
}

if (fs.existsSync(outDir)) {
  console.error("Output already exists:", outDir);
  process.exit(1);
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dst, ent.name);
    if (ent.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(tplDir, outDir);

// set package.json name
const pkgPath = path.join(outDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = name;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log("Created:", outDir);
console.log("Next:");
console.log(`  cd ${name}`);
console.log("  pnpm i");
console.log("  pnpm build && pnpm plugin:copy");

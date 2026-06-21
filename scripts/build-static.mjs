import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "out");

console.log("clean out");
rmSync(outDir, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 });
mkdirSync(outDir, { recursive: true });

console.log("copy html");
copyFileSync(join(root, "static", "index.html"), join(outDir, "index.html"));

console.log("copy posters");
const posterSrcDir = join(root, "public", "posters");
if (existsSync(posterSrcDir)) {
  const posterOutDir = join(outDir, "posters");
  mkdirSync(posterOutDir, { recursive: true });
  for (const file of readdirSync(posterSrcDir)) {
    if (file.endsWith(".svg") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png") || file.endsWith(".webp")) {
      console.log(`copy poster ${file}`);
      copyFileSync(join(posterSrcDir, file), join(posterOutDir, file));
    }
  }
}

for (const asset of ["poster.jpg", "file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg", ".nojekyll"]) {
  const src = join(root, "public", asset);
  if (existsSync(src)) {
    console.log(`copy asset ${asset}`);
    copyFileSync(src, join(outDir, asset));
  }
}

console.log("Static video portfolio exported to out/");

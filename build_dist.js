const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist", "z2m_lock_manager");

const itemsToCopy = [
  "translations",
  "www",
  "__init__.py",
  "api.py",
  "config_flow.py",
  "const.py",
  "manifest.json",
  "store.py",
  "strings.json",
  "icon.png",
];

const srcBase = path.join(__dirname, "custom_components", "z2m_lock_manager");

fs.rmSync(path.join(__dirname, "dist"), { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const item of itemsToCopy) {
  const src = path.join(srcBase, item);
  const dest = path.join(distDir, item);
  if (fs.existsSync(src)) {
    copyRecursiveSync(src, dest);
    console.log(`Copied ${item}`);
  } else {
    console.warn(`Warning: Could not find ${src}`);
  }
}

console.log(`\n✅ Successfully packaged integration into: ${distDir}`);

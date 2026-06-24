const fs = require("fs");
const path = require("path");
const { validateConfig } = require("./configSchema");

/**
 * Convert local image file → base64 data URL
 */
function toDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  const mime =
    ext === ".png" ? "image/png" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
        "application/octet-stream";

  const file = fs.readFileSync(filePath);
  const base64 = file.toString("base64");

  return `data:${mime};base64,${base64}`;
}

/**
 * Normalize user input
 */
function resolveImage(value) {
  if (!value) return null;

  if (
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  const normalized = value.replace(/\\/g, "/");

  const filePath = path.isAbsolute(normalized)
    ? normalized
    : path.join(process.cwd(), normalized);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return toDataUrl(filePath);
}

/**
 * Load config file from project root
 */
function loadMouseConfig() {
  const configPath = path.join(
    process.cwd(),
    "playwright-visible-mouse.json"
  );

  if (!fs.existsSync(configPath)) {
    return {};
  }

  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // ✅ 1. VALIDATE FIRST (THIS IS IMPORTANT)
  const config = validateConfig(raw);

  // ✅ 2. TRANSFORM AFTER VALIDATION
  return {
    isArrow: config.isArrow || false,
    idleImage: resolveImage(config.idleImage),
    clickImage: resolveImage(config.clickImage)
  };
}

/**
 * Generate CSS variables
 */
function getSpriteVariablesCss(config = {}) {
  const vars = [];

  if (config.idleImage) {
    vars.push(`--anime-idle-img: url(${JSON.stringify(config.idleImage)});`);
  }

  if (config.clickImage) {
    vars.push(`--anime-click-img: url(${JSON.stringify(config.clickImage)});`);
  }

  if (vars.length === 0) return "";

  return `:root {\n  ${vars.join("\n  ")}\n}`;
}

module.exports = {
  loadMouseConfig,
  getSpriteVariablesCss
};

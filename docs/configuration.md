# Configuration

The library uses a configuration file in your project root:

```
playwright-visible-mouse.json
```

---

## Default Behavior (No Config File)

If the configuration file does not exist:

- The library will automatically fall back to default settings
- No error will be thrown
- Default behavior:

```json
{
  "isArrow": false,
  "idleImage": null,
  "clickImage": null
}
```

This means:
- Arrow mode is disabled by default
- Built-in mouse assets are used
- No custom images are applied

You can create the config file using the CLI:

```bash
npx playwright-visible-mouse init
```

---

## Example Configuration

```json
{
  "isArrow": false,
  "idleImage": "./assets/idle.png",
  "clickImage": "./assets/click.png"
}
```

---

## Configuration Fields

### isArrow
- Type: boolean
- Default: false
- Description:  
If true, uses arrow-style cursor. If false, uses animated cursor.

---

### idleImage
- Type: string
- Description:  
Image used when the mouse is idle.

Supported formats:
- Relative path
- Absolute path
- URL
- Base64 data URL

---

### clickImage
- Type: string
- Description:  
Image used during click animation.

Supports the same formats as `idleImage`.

---

## Path Handling

The library automatically supports:

- Windows paths: `C:\images\mouse.png`
- Linux paths: `/home/user/mouse.png`
- Relative paths: `./assets/mouse.png`

No manual conversion is required.

---

# CLI

The package includes a CLI tool:

```bash
npx playwright-visible-mouse <command>
```

---

## Available Commands

You can see all commands by running:

```bash
npx playwright-visible-mouse
```

---

### init

Creates a default configuration file in your project root.

```bash
npx playwright-visible-mouse init
```

Output:

```
Created playwright-visible-mouse.json
```

---

### set-image

Updates cursor images in the configuration file.

```bash
npx playwright-visible-mouse set-image <type> <path>
```

---

#### Types

| Type  | Description |
|-------|------------|
| idle  | Sets idle cursor image |
| click | Sets click cursor image |

---

#### Examples

```bash
npx playwright-visible-mouse set-image idle ./assets/idle.png
npx playwright-visible-mouse set-image click ./assets/click.png
```

---

#### Behavior

- Validates file existence
- Supports cross-platform paths
- Stores safe relative paths in config

---

# How It Works

1. Reads `playwright-visible-mouse.json` if it exists
2. Falls back to default configuration if missing
3. Validates configuration values
4. Converts image paths to base64 (if provided)
5. Injects CSS variables into the page
6. Renders cursor overlay in Playwright

---

## CSS Variables

The library injects:

```css
:root {
  --anime-idle-img: url(...);
  --anime-click-img: url(...);
}
```

These variables are used by the cursor rendering system.

---

# Troubleshooting

## Config not found

Make sure this file exists in your project root:

```
playwright-visible-mouse.json
```

Or run:

```bash
npx playwright-visible-mouse init
```

---

## Image not loading

Check:

- File path is correct
- File exists
- Format is supported (png, jpg, jpeg)

---

## CLI not working

Try:

```bash
npx playwright-visible-mouse
```

or:

```bash
npx playwright-visible-mouse init
```

---

# Notes

- Large images may affect performance (recommended < 300KB)
- Config is loaded per page session
- Designed specifically for Playwright Page objects

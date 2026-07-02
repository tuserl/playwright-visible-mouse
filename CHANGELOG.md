# Changelog

## 1.4.1 - 2026-07-02

### Fixed
- `--trace off` was ignored in worker processes; CLI flags weren't forwarded
  from the main process, so tracing stayed on regardless of the flag.

### Changed
- Moved legacy launch-mode fixture wiring out of `createFramework.js` into
  `framework/legacy/launchMode.js` (no behavior change).

## 1.4.0 - 2026-06-30

### Changed

- Refactored browser architecture to support Playwright attach mode.
- Trace Viewer now records full DOM snapshots instead of displaying `about:blank`.

## 1.3.1 - 2026-06-29

### Fixed
- Fixed `exists()` falsely matching Playwright Visible Mouse notification overlays.
- Notification UI is now ignored during element detection to prevent false positives.
- Added a warning when a framework notification matches the searched locator, helping users avoid duplicate text between notifications and page content.

## 1.3.0 - 2026-06-28

### Added

- Added `autoTile` to automatically assign window positions based on Playwright worker `parallelIndex`.
- Added support for custom screen resolutions in `split2` and `split4` modes.
- Added `reuseBrowser` framework option for reusing browser instances across tests within the same worker.

## 1.2.1 - 2026-06-28

### Fixed

- Fixed `tileIndex` support by adding worker-aware browser session handling in the framework.

## 1.2.0 - 2026-06-27

### Added

- Added `demoNotification` for displaying test execution messages in the browser.
- Added a new Testing Framework with automatic Playwright fixture generation and session management.
- Added CLI commands for generating test files and page objects.

## 1.1.0 - 2026-06-26

### Added

- Added field key press support
- Added page reload support
- Added `button()` selector support (see issue #1 for details)
- Added selector support to `BrowserManager`
- Added unit tests and integration tests
- Added `testUtils` for testing helpers

### Changed

- Changed `index.js` exports to use the package entry point instead of importing directly from `lib`
- Updated demos

### Fixed

- Fixed Normal Interaction Mode to use human-like typing

## 1.0.4 - 2026-06-25

### Added
- Mouse Interaction Mode Setting 
- img, checkbox, radio, select, tableCell, selectOption

## 1.0.3 - 2026-06-25

### Added
- Text element support for Browser Manager

## 1.0.2 - 2026-06-24

### Added
- Demo mouse configuration for custom sprite images
- CLI binary command
- Boolean function to check whether a UI element exists

### Fixed
- Check that a UI element exists before clicking it

## 1.0.0 - 2026-06-23

### Added
- Initial demo mouse implementation

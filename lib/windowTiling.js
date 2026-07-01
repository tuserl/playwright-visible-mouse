function computeWindowArgs({ mode, tileIndex = 0, screenWidth = 1920, screenHeight = 1080 }) {
  const args = [];
  let idx = tileIndex;

  if (mode === "split2") {
    idx %= 2;
    const w = Math.floor(screenWidth / 2);
    args.push(
      `--window-position=${idx === 0 ? 0 : w},0`,
      `--window-size=${w},${screenHeight}`
    );
  } else if (mode === "split4") {
    idx %= 4;
    const w = Math.floor(screenWidth / 2);
    const h = Math.floor(screenHeight / 2);
    const positions = [[0, 0], [w, 0], [0, h], [w, h]];
    args.push(
      `--window-position=${positions[idx][0]},${positions[idx][1]}`,
      `--window-size=${w},${h}`
    );
  } else {
    args.push("--start-maximized");
  }

  return { args, resolvedTileIndex: idx };
}

module.exports = { computeWindowArgs };

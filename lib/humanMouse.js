const {
  generateHumanPath,
  generateDynamicRandomPath,
  generateRandomTargetDimensions
} = require("./mouseUtils");

// ============================================================================
// 🌟 SEPARATE HUMANIZED & RANDOMIZED EXTENSION METHODS
// ============================================================================
module.exports = {
  async moveToPositionHuman(x, y) {
    const steps = 25;
    const pathCoordinates = generateHumanPath(this.lastX, this.lastY, x, y, steps);

    for (const point of pathCoordinates) {
      await this.page.evaluate(({ x, y }) => {
        if (window.moveFakeMouse) window.moveFakeMouse(x, y);
      }, { x: point.x, y: point.y });

      await this.page.mouse.move(point.x, point.y);
      await this.page.waitForTimeout(10 + Math.floor(Math.random() * 5));
    }

    this.lastX = x;
    this.lastY = y;

    await this.waitForCursorSettle();
  },

  async moveToHuman(target) {
    let locator = typeof target === "string" ? this.page.locator(target) : target;
    const box = await locator.boundingBox();
    if (!box) throw new Error("Element not found");

    const paddingX = box.width * 0.15;
    const paddingY = box.height * 0.15;
    const targetX = (box.x + box.width / 2) + ((Math.random() - 0.5) * paddingX);
    const targetY = (box.y + box.height / 2) + ((Math.random() - 0.5) * paddingY);

    await this.moveToPositionHuman(targetX, targetY);
  },

  async clickHuman(target) {
    await this.moveToHuman(target);
    await this.page.evaluate(() => {
      if (window.clickAnimation) window.clickAnimation();
    });
    await this.page.waitForTimeout(120);

    if (typeof target === "string") {
      await this.page.click(target, { force: true });
    } else {
      await target.click({ force: true });
    }
  },

  async randomMoveHuman() {
    let viewWidth = 1280;
    let viewHeight = 720;

    try {
      const activeViewport = this.page.viewportSize();
      if (activeViewport) {
        viewWidth = activeViewport.width;
        viewHeight = activeViewport.height;
      } else {
        const browserDimensions = await this.page.evaluate(() => ({
          w: window.innerWidth,
          h: window.innerHeight
        }));
        viewWidth = browserDimensions.w;
        viewHeight = browserDimensions.h;
      }
    } catch (err) { }

    const coordinates = generateRandomTargetDimensions(this.lastX, this.lastY, viewWidth, viewHeight);
    await this.moveToPositionHuman(coordinates.x, coordinates.y);
  },

  async moveToPositionHumanRandom(x, y) {
    const pathCoordinates = generateDynamicRandomPath(this.lastX, this.lastY, x, y);

    for (const point of pathCoordinates) {
      await this.page.evaluate(({ x, y }) => {
        if (window.moveFakeMouse) window.moveFakeMouse(x, y);
      }, { x: point.x, y: point.y });

      await this.page.mouse.move(point.x, point.y);
      await this.page.waitForTimeout(8 + Math.floor(Math.random() * 6));
    }

    this.lastX = x;
    this.lastY = y;

    await this.waitForCursorSettle();
  },

  async moveToHumanRandom(target) {
    let locator = typeof target === "string" ? this.page.locator(target) : target;
    const box = await locator.boundingBox();
    if (!box) throw new Error("Element not found");

    const paddingX = box.width * 0.15;
    const paddingY = box.height * 0.15;
    const targetX = (box.x + box.width / 2) + ((Math.random() - 0.5) * paddingX);
    const targetY = (box.y + box.height / 2) + ((Math.random() - 0.5) * paddingY);

    await this.moveToPositionHumanRandom(targetX, targetY);
  },

  async typeHumanRandom(target, text, baseDelay = 100) {
    // First, focus the element naturally
    await this.clickHumanRandom(target);

    let locator = typeof target === "string" ? this.page.locator(target) : target;

    // Split the text into characters
    const chars = text.split('');

    for (const char of chars) {
      // Generate random jitter: between 50% and 150% of the base delay
      const jitter = Math.random() * (baseDelay * 1.5 - baseDelay * 0.5) + (baseDelay * 0.5);

      await this.page.waitForTimeout(jitter);
      await locator.press(char);
    }
  },


  async clickHumanRandom(target) {
    await this.moveToHumanRandom(target);
    await this.page.evaluate(() => {
      if (window.clickAnimation) window.clickAnimation();
    });
    await this.page.waitForTimeout(120);

    if (typeof target === "string") {
      await this.page.click(target, { force: true });
    } else {
      await target.click({ force: true });
    }
  },

  async waitForCursorSettle() {
    await this.page.evaluate(async () => {
      if (!window.demoMouse) return;
      return new Promise((resolve) => {
        function check() {
          const dx = Math.abs(window.demoMouse.targetX - window.demoMouse.x);
          const dy = Math.abs(window.demoMouse.targetY - window.demoMouse.y);
          // If the visual cursor is less than 0.5 pixels away from target, it's settled
          if (dx < 0.5 && dy < 0.5) {
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        }
        check();
      });
    });
  }



};

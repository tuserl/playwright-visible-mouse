const path = require("path");

class DemoMouse {
  constructor(page, color = "transparent") {
    this.page = page;
    this.color = color;

    // 🌟 1. MEMORY TRACKING: Save coordinates on the Node.js side
    this.lastX = 0;
    this.lastY = 0;
  }

  async install() {
    const injectMouse = async () => {
      try {

        // 1. Playwright reads assets from disk and pushes them into browser memory
        await this.page.addStyleTag({
          path: path.join(__dirname, "mouseAssets.css"),
        });

        // 1.1. Playwright pushes the layout styling right after
        await this.page.addStyleTag({
          path: path.join(__dirname, "demoMouse.css"),
        });


        // 🌟 2. PASS MEMORY: Send lastX and lastY into the browser environment
        await this.page.evaluate(({ lastX, lastY }) => {
          if (document.getElementById("demoMouseWrapper")) return;

          const wrapper = document.createElement("div");
          wrapper.id = "demoMouseWrapper";

          const mouse = document.createElement("div");
          mouse.id = "demoMouse";

          // Pre-position the element immediately so it doesn't blink at 0,0 for a split second
          mouse.style.left = lastX + "px";
          mouse.style.top = lastY + "px";

          wrapper.appendChild(mouse);
          document.body.appendChild(wrapper);

          // 🌟 3. RESTORE STATE: Initialize the mouse at the stored coordinates
          window.demoMouse = {
            x: lastX,
            y: lastY,
            targetX: lastX,
            targetY: lastY,
          };

          window.moveFakeMouse = function (x, y) {
            demoMouse.targetX = x;
            demoMouse.targetY = y;
          };

          window.setCursorColor = function (color) {
            document.getElementById("demoMouse").style.backgroundColor = color;
          };

          window.clickAnimation = function () {
            const mouseEl = document.getElementById("demoMouse");
            const wrapperEl = document.getElementById("demoMouseWrapper");
            if (!mouseEl || !wrapperEl) return;

            mouseEl.style.scale = "0.75";
            setTimeout(() => { mouseEl.style.scale = "1"; }, 150);

            mouseEl.classList.add("clicking");
            setTimeout(() => { mouseEl.classList.remove("clicking"); }, 300);

            const ripple = document.createElement("div");
            ripple.className = "click-ripple";
            ripple.style.left = demoMouse.x + "px";
            ripple.style.top = demoMouse.y + "px";

            wrapperEl.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 400);
          };

          function animate() {
            demoMouse.x += (demoMouse.targetX - demoMouse.x) * 0.15;
            demoMouse.y += (demoMouse.targetY - demoMouse.y) * 0.15;
            mouse.style.left = demoMouse.x + "px";
            mouse.style.top = demoMouse.y + "px";
            requestAnimationFrame(animate);
          }

          animate();
        }, { lastX: this.lastX, lastY: this.lastY }); // Pass the object here

        await this.page.evaluate((color) => {
          if (window.setCursorColor) window.setCursorColor(color);
        }, this.color);

      } catch (err) {
        console.log("Mouse sync preservation active...");
      }
    };

    await injectMouse();

    this.page.on("load", async () => {
      await injectMouse();
    });
  }

  async moveTo(target) {
    let locator = typeof target === "string" ? this.page.locator(target) : target;
    const box = await locator.boundingBox();
    if (!box) throw new Error("Element not found");

    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    // 🌟 4. SAVE POSITION: Update the master coordinates right before moving
    this.lastX = x;
    this.lastY = y;

    await this.page.evaluate(({ x, y }) => {
      if (window.moveFakeMouse) moveFakeMouse(x, y);
    }, { x, y });



    // ⚡ TURBO FIX: Cut down glide wait from 400ms to 180ms
    await this.page.waitForTimeout(180);
    await this.page.mouse.move(x, y);

    // ⚡ TURBO FIX: Cut down hover settle from 100ms to 30ms
    await this.page.waitForTimeout(30);

  }

  async click(target) {
    await this.moveTo(target);
    await this.page.evaluate(() => {
      if (window.clickAnimation) window.clickAnimation();
    });
    await this.page.waitForTimeout(80);

    if (typeof target === "string") {
      await this.page.click(target);
    } else {
      await target.click();
    }
  }

  async type(target, text, delay = 100) {
    await this.click(target);
    await this.page.waitForTimeout(150);

    let locator = typeof target === "string" ? this.page.locator(target) : target;
    await locator.pressSequentially(text, { delay: delay });
    await this.page.waitForTimeout(200);
  }

  async focus() {
    await this.page.bringToFront();
    await this.page.waitForTimeout(500);
  }
}

module.exports = DemoMouse;

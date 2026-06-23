const path = require("path");
const humanMethods = require("./humanMouse");

class DemoMouse {
  constructor(page, color = "transparent") {
    this.page = page;
    this.color = color;
    this.lastX = 0;
    this.lastY = 0;
  }

  async install() {
    const injectMouse = async () => {
      try {
        await this.page.addStyleTag({ path: path.join(__dirname, "mouseAssets.css") });
        await this.page.addStyleTag({ path: path.join(__dirname, "demoMouse.css") });

        await this.page.evaluate(({ lastX, lastY }) => {
          if (document.getElementById("demoMouseWrapper")) return;

          const wrapper = document.createElement("div");
          wrapper.id = "demoMouseWrapper";
          const mouse = document.createElement("div");
          mouse.id = "demoMouse";
          mouse.style.left = lastX + "px";
          mouse.style.top = lastY + "px";
          wrapper.appendChild(mouse);
          document.body.appendChild(wrapper);

          window.demoMouse = {
            x: lastX, y: lastY, targetX: lastX, targetY: lastY,
            isLocked: true, notFollowUser: false, isDragging: false
          };

          window.moveFakeMouse = (x, y) => { if (window.demoMouse.isLocked) { demoMouse.targetX = x; demoMouse.targetY = y; } };

          window.clickAnimation = (forcedX, forcedY) => {
            const mouseEl = document.getElementById("demoMouse");
            const wrapperEl = document.getElementById("demoMouseWrapper");
            if (!mouseEl || !wrapperEl) return;
            const x = forcedX !== undefined ? forcedX : demoMouse.x;
            const y = forcedY !== undefined ? forcedY : demoMouse.y;
            mouseEl.style.scale = "0.75";
            setTimeout(() => { mouseEl.style.scale = "1"; }, 150);
            mouseEl.classList.add("clicking");
            setTimeout(() => { mouseEl.classList.remove("clicking"); }, 300);
            const ripple = document.createElement("div");
            ripple.className = "click-ripple";
            ripple.style.left = x + "px"; ripple.style.top = y + "px";
            wrapperEl.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 400);
          };

          // Global Click Listener for Animations
          window.addEventListener("click", (e) => {
            if (!window.demoMouse.isLocked) {
              if (!window.demoMouse.notFollowUser) {
                window.demoMouse.targetX = e.clientX;
                window.demoMouse.targetY = e.clientY;
              }
              window.clickAnimation(e.clientX, e.clientY);
            }
          });

          // Follow Mode
          window.addEventListener("mousemove", (e) => {
            if (!window.demoMouse.isLocked && !window.demoMouse.notFollowUser) {
              window.demoMouse.targetX = e.clientX;
              window.demoMouse.targetY = e.clientY;
            }
          });

          // Drag Mode
          mouse.addEventListener("mousedown", (e) => {
            if (!window.demoMouse.isLocked && window.demoMouse.notFollowUser) {
              window.demoMouse.isDragging = true;
              mouse.style.cursor = "grabbing";
              mouse.classList.add("dragging");
              window.clickAnimation();
              window.demoMouse.targetX = e.clientX;
              window.demoMouse.targetY = e.clientY;
            }
          });

          window.addEventListener("mousemove", (e) => {
            if (!window.demoMouse.isLocked && window.demoMouse.notFollowUser && window.demoMouse.isDragging) {
              window.demoMouse.targetX = e.clientX;
              window.demoMouse.targetY = e.clientY;
            }
          });

          window.addEventListener("mouseup", () => {
            if (window.demoMouse.isDragging) {
              window.demoMouse.isDragging = false;
              mouse.style.cursor = "grab";
              mouse.classList.remove("dragging");
            }
          });

          function animate() {
            const easeMultiplier = window.demoMouse.isDragging ? 1.0 : 0.15;
            demoMouse.x += (demoMouse.targetX - demoMouse.x) * easeMultiplier;
            demoMouse.y += (demoMouse.targetY - demoMouse.y) * easeMultiplier;
            mouse.style.left = demoMouse.x + "px";
            mouse.style.top = demoMouse.y + "px";
            requestAnimationFrame(animate);
          }
          animate();
        }, { lastX: this.lastX, lastY: this.lastY });
      } catch (err) { console.log("Mouse sync active."); }
    };
    await injectMouse();
    this.page.on("load", async () => { await injectMouse(); });
  }

  async setLockState(isLocked, notFollowUser = false) {
    await this.page.evaluate(({ isLocked, notFollowUser }) => {
      const mouseEl = document.getElementById("demoMouse");
      window.demoMouse.isLocked = isLocked;
      window.demoMouse.notFollowUser = notFollowUser;
      if (mouseEl) {
        mouseEl.style.pointerEvents = (!isLocked && notFollowUser) ? "auto" : "none";
        mouseEl.style.cursor = (!isLocked && notFollowUser) ? "grab" : "default";
        if (isLocked) mouseEl.classList.remove("dragging");
      }
    }, { isLocked, notFollowUser });
  }

  // --- Standard Methods remain unchanged below ---
  async moveToPosition(x, y) {
    this.lastX = x; this.lastY = y;
    await this.page.evaluate(({ x, y }) => { if (window.moveFakeMouse) window.moveFakeMouse(x, y); }, { x, y });
    await this.page.waitForTimeout(180);
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(30);
  }

  async moveTo(target) {
    let locator = typeof target === "string" ? this.page.locator(target) : target;
    const box = await locator.boundingBox();
    if (!box) throw new Error("Element not found");
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.moveToPosition(x, y);
  }

  async click(target) {
    await this.moveTo(target);
    await this.page.evaluate(() => { if (window.clickAnimation) window.clickAnimation(); });
    await this.page.waitForTimeout(80);
    if (typeof target === "string") await this.page.click(target);
    else await target.click();
  }

  async type(target, text, delay = 100) {
    await this.click(target);
    await this.page.waitForTimeout(150);
    let locator = typeof target === "string" ? this.page.locator(target) : target;
    await locator.pressSequentially(text, { delay: delay });
  }

  async focus() { await this.page.bringToFront(); await this.page.waitForTimeout(500); }
}

Object.assign(DemoMouse.prototype, humanMethods);
module.exports = DemoMouse;

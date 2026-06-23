// ============================================================================
// 🧠 STANDALONE HUMAN PATH GENERATION UTILITIES
// ============================================================================

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function getBezierPoint(p0, p1, p2, p3, t) {
  const cX = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
  const cY = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
  return { x: cX, y: cY };
}

// 🌟 ORIGINAL LEGACY FUNCTION
function generateHumanPath(startX, startY, endX, endY, steps = 25) {
  const start = { x: startX, y: startY };
  const end = { x: endX, y: endY };
  const distance = Math.hypot(endX - startX, endY - startY);
  if (distance < 10) return [end];

  const deviationMagnitude = (Math.random() - 0.5) * (distance * 0.3);
  const p1 = { x: start.x + (end.x - start.x) * 0.25 + deviationMagnitude, y: start.y + (end.y - start.y) * 0.25 - deviationMagnitude };
  const p2 = { x: start.x + (end.x - start.x) * 0.75 - deviationMagnitude, y: start.y + (end.y - start.y) * 0.75 + deviationMagnitude };

  const pathPoints = [];
  for (let i = 1; i <= steps; i++) {
    pathPoints.push(getBezierPoint(start, p1, p2, end, easeInOutQuad(i / steps)));
  }
  return pathPoints;
}

// 🌟 SEPARATE DYNAMIC RANDOM UTILITY
function generateDynamicRandomPath(startX, startY, endX, endY) {
  const start = { x: startX, y: startY };
  const end = { x: endX, y: endY };
  const distance = Math.hypot(endX - startX, endY - startY);
  if (distance < 10) return [end];

  const steps = Math.floor(Math.random() * 10) + 22;

  const dev1x = (Math.random() - 0.5) * (distance * 0.35);
  const dev1y = (Math.random() - 0.5) * (distance * 0.35);
  const dev2x = (Math.random() - 0.5) * (distance * 0.35);
  const dev2y = (Math.random() - 0.5) * (distance * 0.35);

  const weight1 = 0.15 + Math.random() * 0.20;
  const weight2 = 0.60 + Math.random() * 0.25;

  const p1 = { x: start.x + (end.x - start.x) * weight1 + dev1x, y: start.y + (end.y - start.y) * weight1 + dev1y };
  const p2 = { x: start.x + (end.x - start.x) * weight2 + dev2x, y: start.y + (end.y - start.y) * weight2 + dev2y };

  const pathPoints = [];
  for (let i = 1; i <= steps; i++) {
    pathPoints.push(getBezierPoint(start, p1, p2, end, easeInOutQuad(i / steps)));
  }
  return pathPoints;
}

function generateRandomTargetDimensions(currentX, currentY, viewWidth, viewHeight) {
  const padding = 60;
  const targetX = Math.floor(Math.random() * (viewWidth - padding * 2)) + padding;
  const targetY = Math.floor(Math.random() * (viewHeight - padding * 2)) + padding;
  return { x: targetX, y: targetY };
}

module.exports = {
  generateHumanPath,
  generateDynamicRandomPath,
  generateRandomTargetDimensions
};

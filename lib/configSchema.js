const { z } = require("zod");

const mouseConfigSchema = z.object({
  isArrow: z.boolean().optional(),

  idleImage: z.string().optional(),

  clickImage: z.string().optional(),
});

function validateConfig(config) {
  const result = mouseConfigSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.issues
      .map(e => `- ${e.path.join(".")}: ${e.message}`)
      .join("\n");

    throw new Error(
      `[playwright-visible-mouse] Invalid config:\n${formatted}`
    );
  }

  return result.data;
}

module.exports = {
  validateConfig
};

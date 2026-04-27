
import pino from "pino";

export const logger = pino({
  level: "debug",
  formatters: {
    level(label) {
      return { level: label };
    },
  },
});

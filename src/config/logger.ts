import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { env } from "./env";

const transports: winston.transport[] = [new winston.transports.Console()];

if (env.LOG_FILE_ENABLED)
  transports.push(
    new DailyRotateFile({
      createSymlink: true,
      dirname: "logs",
      filename: "app.%DATE%.log",
      level: "debug",
      maxFiles: "7",
      maxSize: "20m",
      zippedArchive: true,
    }),
  );

export default winston.createLogger({ transports: transports });

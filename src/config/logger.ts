import DailyRotateFile from "winston-daily-rotate-file";
import winston from "winston";

export default winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      createSymlink: true,
      dirname: "logs",
      filename: "app.%DATE%.log",
      level: "debug",
      maxFiles: "7",
      maxSize: "20m",
      silent: process.env.NODE_ENV === "production", // Disable file logging in production
      zippedArchive: true,
    }),
  ],
});

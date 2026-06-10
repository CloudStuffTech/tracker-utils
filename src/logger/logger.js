const winston = require("winston");
const { maskData } = require("./mask");

const logger = (() => {
    let LOGGER_ENABLED = true;
    let requestId = "sys_default";
    let userId = "sys_default";
    let user = "sys_default";
    let logr;

    const init = ({ service, enableConsoleLog = false, loggerEnabled = true }) => {
        if (!loggerEnabled) LOGGER_ENABLED = false;
        logr = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            defaultMeta: { service },
            transports: [
                new winston.transports.File({
                    filename: "combined.log",
                    format: winston.format.printf((info) => getLogstring(info)),
                }),
            ],
        });
        // Add log on console in case of dev environment
        if (enableConsoleLog) {
            logr.add(
                new winston.transports.Console({
                    format: winston.format.printf((info) => getLogstring(info)),
                })
            );
        }
    };

    const updateLogData = (data) => {
        if (data["requestId"]) requestId = data["requestId"];
        if (data["userId"]) userId = data["userId"];
        if (data["user"]) userType = data["user"];
    };

    const getLogstring = (info) => {
    const safeMessage = maskData(info.message);
    const printableMessage =
        typeof safeMessage === "object"
            ? JSON.stringify(safeMessage)
            : safeMessage;

    return `[REQ_ID: ${requestId}][USER: ${user}][USER_ID: ${userId}][LEVEL:${info.level}][MSG:${printableMessage}]`;
    };

    const info = (msg) => {
        if (!LOGGER_ENABLED || !logr) return;
        logr.info(msg);
    };

    const error = (msg) => {
        if (!LOGGER_ENABLED || !logr) return;
        logr.error(msg);
    };

    const warn = (msg) => {
        if (!LOGGER_ENABLED || !logr) return;
        logr.warn(msg);
    };

    return {
        info,
        error,
        warn,
        updateLogData,
        init,
    };
})();

module.exports = { logger };

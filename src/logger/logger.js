const winston = require("winston");

const logger = (() => {
	const LOGGER_ENABLED = true;
	let requestId = "sys_default";
	let userId = "sys_default";
	let user = "sys_default";

	const logr = winston.createLogger({
		level: "info",
		format: winston.format.json(),
		defaultMeta: { service: "pb-srvc" },
		transports: [
			new winston.transports.File({ filename: "combined.log", format: winston.format.printf((info) => getLogstring(info)) }),
		],
	});

	if (process.env.NODE_ENV !== "production") {
		logr.add(
			new winston.transports.Console({
				// format: winston.format.simple(),
				format: winston.format.printf((info) => getLogstring(info)),
			})
		);
	}

	const updateLogData = (data) => {
		if (data["requestId"]) requestId = data["requestId"];
		if (data["userId"]) userId = data["userId"];
		if (data["user"]) userType = data["user"];
	};

	const getLogstring = (info) => {
		return `[REQ_ID: ${requestId}][USER: ${user}][USER_ID: ${userId}][LEVEL:${info.level}][MSG:${info.message}]`;
	};

	const info = (msg) => {
		if (!LOGGER_ENABLED) return;
		logr.info(msg);
	};

	const error = (msg) => {
		if (!LOGGER_ENABLED) return;
		logr.error(msg);
	};

	const warn = (msg) => {
		if (!LOGGER_ENABLED) return;
		logr.warn(msg);
	};

	return {
		info,
		error,
		warn,
		updateLogData,
	};
})();

module.exports = { logger };

const devTool = (() => {
	const NODE_ENV = process.env.NODE_ENV;

	const isDevEnv = () => NODE_ENV == "development" || NODE_ENV == "dev";

	const isPubsubEmulatorOn = () => process.env.PUBSUB_EMULATOR;

	return {
		isDevEnv,
		isPubsubEmulatorOn,
	};
})();

module.exports = { devTool };

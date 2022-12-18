const tools = (() => {
	handleShutdown = ({ params, handleInterrupt }) => {
		// Quit from keyboard ctl + c
		process.on("SIGINT", () => handleInterrupt("SIGINT", params));
		// Quit from keyboard
		process.on("SIGQUIT", () => handleInterrupt("SIGQUIT", params));
		// quit by operating system kill command
		process.on("SIGTERM", () => handleInterrupt("SIGTERM", params));
	};

	/**
	 * Call this function to sleep for a given milliseconds
	 * @param  {Number} ms time in milliseconds
	 * @return {Promise}
	 */
	function sleep(ms) {
		return new Promise(resolve => {
			setTimeout(() => resolve(true), ms);
		})
	}

	return {
		handleShutdown,
		sleep
	};
})();

module.exports = { tools };

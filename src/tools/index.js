const handleShutdown = ({ params, handleInterrupt }) => {
	// Quit from keyboard ctl + c
	process.once("SIGINT", () => handleInterrupt("SIGINT", params));
	// Quit from keyboard
	process.once("SIGQUIT", () => handleInterrupt("SIGQUIT", params));
	// quit by operating system kill command
	process.once("SIGTERM", () => handleInterrupt("SIGTERM", params));
};

/**
 * Call this function to sleep for a given milliseconds
 * @param  {Number} ms time in milliseconds
 * @return {Promise}
 */
const sleep = async (ms) => {
	return new Promise(resolve => {
		setTimeout(() => resolve(true), ms);
	})
}

module.exports = { handleShutdown, sleep }

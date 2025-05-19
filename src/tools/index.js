const handleShutdown = ({ params, handleInterrupt }) => {
	// Quit from keyboard Ctrl + C
	process.once("SIGINT", () => handleInterrupt("SIGINT", params));
	// Quit from keyboard
	process.once("SIGQUIT", () => handleInterrupt("SIGQUIT", params));
	// Quit by operating system kill command
	process.once("SIGTERM", () => handleInterrupt("SIGTERM", params));
	// User-defined signal 2
	process.once("SIGUSR2", () => handleInterrupt("SIGUSR2", params));
	/**
	 *  User-defined signal 1
	 *  Note: SIGUSR1 is often used by Node.js internally (e.g., for restarting the debugger), so be cautious when using it in production.
	 */
	process.once("SIGUSR1", () => handleInterrupt("SIGUSR1", params));
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

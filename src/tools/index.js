const tools = (() => {
    handleShutdown = ({ params, handleInterrupt }) => {
        // Quit from keyboard ctl + c
        process.on("SIGINT", () => handleInterrupt("SIGINT", params));
        // Quit from keyboard
        process.on("SIGQUIT", () => handleInterrupt("SIGQUIT", params));
        // quit by operating system kill command
        process.on("SIGTERM", () => handleInterrupt("SIGTERM", params));
    };

    return {
        handleShutdown,
    };
})();

module.exports = { tools };

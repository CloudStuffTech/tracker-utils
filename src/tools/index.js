const tools = () => {
    handleShutdown = ({ params, handleInterrupt }) => {
        // Quit from keyboard ctl + c
        process.on("SIGINT", () => handleInterrupt(params));
        // Quit from keyboard
        process.on("SIGQUIT", () => handleInterrupt(params));
        // quit by operating system kill command
        process.on("SIGTERM", () => handleInterrupt(params));
    };

    return {
        handleShutdown,
    };
};

module.exports = { tools };

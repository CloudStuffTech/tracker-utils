const got = require("got");

const request = (() => {
    const get = async ({ endpoint, retry = 3 }) => {
        try {
            const options = { retry: { limit: retry } };
            const start = Date.now();
            const data = await got.get(endpoint, options);

            return { data, err: null, latency: Date.now() - start };
        } catch (err) {
            return { data: null, err, latency: null };
        }
    };
    return {
        get,
    };
})();

module.exports = { request };

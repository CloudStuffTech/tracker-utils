const got = require("got");

const request = (() => {
    const get = async ({ endpoint, retry = 3 }) => {
        try {
            const options = { retry: { limit: retry } };
            const data = await got.get(endpoint, options);

            return { data, err: null };
        } catch (err) {
            return { data: null, err };
        }
    };
    return {
        get,
    };
})();

module.exports = { request };

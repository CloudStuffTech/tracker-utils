const got = require("got");

const httpReq = (() => {
	const get = async ({ endpoint }) => {
		try {
			const data = await got.get(endpoint);

			return { data, err: null };
		} catch (err) {
			return { data: null, err };
		}
	};
	return {
		get,
	};
})();

module.exports = { httpReq };

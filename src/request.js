// External Deps
const axios = require("axios");

/**
 * Request class acts as a wrapper to perform GET/POST requests via axios
 */
class Request {

	constructor() { }

	/**
	 * [PUBLIC] This function will perform a GET request and return response data. 
	 * Note: non-success cases to be handled where invoked.
	 * 
	 * @param {string} path - Complete URL / API path
	 * @param {object} params - Request parameters to be sent out
	 * @param {object} headers - headers associated with the request
	 * 
	 * @returns {Promise<any>}
	 */
	static async get(path, params = {}, headers = {}) {
		const response = await axios.get(path, { params, headers: { "User-Agent": "curl/7.49.0", ...headers } });
		return (response) ? response.data : null;
	}

	/**
	 * [PUBLIC] This function will perform a POST request and return response data. 
	 * Note: non-success cases to be handled where invoked.
	 * 
	 * @param {string} path - Complete URL / API path
	 * @param {object|string} body - Request body to be sent out
	 * @param {object} headers - headers associated with the request
	 * 
	 * @returns {Promise<any>}
	 */
	static async post(path, body, headers = {}) {
		const response = await axios.post(path, body, { headers: { "User-Agent": "curl/7.49.0", ...headers } });
		return (response) ? response.data : null;
	}

}

module.exports = Request;

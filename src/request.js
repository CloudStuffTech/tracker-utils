// External Deps
const axios = require("axios");
const packageJson = require("./../package.json");
const { tools } = require("./tools");

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
		const response = await axios.get(path, { params, headers: { "User-Agent": `Tracker Utils ${packageJson.version}`, ...headers } });
		return (response) ? response.data : null;
	}

	/**
	 * [PUBLIC] This function will perform a GET request with default retry of 3 and return response data, err, latency.
	 * 
	 * @param {object}
	 * 
	 * @returns {Promise<any>}
	 */
	static async getV2({ path, params = {}, headers = {}, retryDelay = 200, retry = 3 }) {
		const start = Date.now();
		let data = null;
		let err = null;

		for (let i = 0; i < retry; i++) {
			try {
				data = await this.get(path, params, headers)
				// If got reponse in 2nd or later retry reset the error to null.
				err = null;
				break;
			} catch (error) {
				err = error;
			}
			await tools.sleep(i + 1 * retryDelay)
		}

		return { data, err, latency: Date.now() - start };
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
		const response = await axios.post(path, body, { headers: { "User-Agent": `Tracker Utils ${packageJson.version}`, ...headers } });
		return (response) ? response.data : null;
	}

}

module.exports = Request;

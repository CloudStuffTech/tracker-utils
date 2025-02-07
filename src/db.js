let _ = require('lodash');
let Cache = require('./cache');
let Security = require('./security');

/**
 * @package Cloudstuff Tracker Utils
 * @module Db
 * @version 1.0
 * @author Hemant Mann <hemant.mann@trackier.com>
 */
class Db {
	constructor(conn) {
		this.conn = conn || null;
		// Each DB object will be long lived so we are generating a new cache object each
		// time with a random prefix to reduce the work of the User
		this.cache = new Cache({prefix: Security.id()});
		this.models = {};
	}

	/**
	 * Registers a model on the connection if not already registered
	 * @param {String}			name Name of the model
	 * @param {Mongoose.Schema} schema Model Schema
	 */
	setModel(name, schema) {
		if (typeof this.models[name] === "undefined") {
			this.models[name] = this.conn.model(name, schema);
		}
	}

	/**
	 * Get the model from the model MAP
	 * @param {String} name Name of the model
	 */
	getModel(name) {
		return this.models[name];
	}

	/**
	 * This method will return the columns for a given schema
	 * @param  {String} name Name of the model
	 * @return {Array}      []string
	 */
	getModelCols(name) {
		let m = this.models[name];
		if (!m) {
			return [];
		}
		return _.keys(m.schema.paths);
	}

	/**
	 * Store the connection object which will be used to make query to the database
	 * @param {Mongoose.Connection} obj
	 */
	setConn(obj) {
		this.conn = obj
	}

	async removeCache(key) {
		await this.cache.delete(key);
	}

	/**
	 * Get the Cache Key for based on the model, query and fields supplied to the
	 * function by generating a signature with combination of all three
	 * @param  {String} model  Name of the Model
	 * @param  {Object} query  Query object which will be passed to mongodb
	 * @param  {String} fields List of fields separated by "space"
	 * @return {String}        Unique Cache Key
	 */
	getCacheKey(model, query, fields) {
		let qstr = convertQueryToStr(query);
		let key = `${model}:${qstr}`;
		if (fields) {
			key += ":" + fields;
		}
		return "CC:" + Security.md5(key);
	}

	getCacheKeyWithOpts(model, query, fields, opts) {
		let qstr = convertQueryToStr(query);
		let key = `${model}:${qstr}`;
		if (fields) {
			key += ":" + fields;
		}
		if (opts) {
			let optsQstr = convertQueryToStr(opts);
			key += ":" + optsQstr;
		}
		return "CC:" + Security.md5(key);
	}

	/**
	 * Query the database model with the provided query
	 * @param  {String} m     Model Name
	 * @param  {Object} query Query obj
	 * @return {Object|null}       Result returned by the driver
	 */
	async first(m, q, opts) {
		let query = this.conn.model(m).findOne(q);
		if (opts && opts.maxTimeMS) {
			query.maxTimeMS(opts.maxTimeMS);
		}

		return query.lean().exec();
	}

	/**
	 * Check the cache for the object by making the unique cache if not found then
	 * Query the database model with the provided query and also set the obj in cache
	 * @param  {Number} t     Time in seconds for the which the object is to be cached if found
	 */
	async _cacheFirst(m, q, opts) {
		let cacheKey = this.getCacheKey(m, q);
		let {cacheObj, error} = await this.cache.getv2(cacheKey);
		if (cacheObj === undefined) {
			cacheObj = await this.first(m, q, opts);
			await this.cache.set(cacheKey, cacheObj, opts && opts.timeout ? opts.timeout : 0)
		}
		if (opts && opts.lean == false) {
			let model = this.getModel(m);
			cacheObj = new model(cacheObj);
		}
		return cacheObj;
	}

	/**
	 * Public wrapper for the private method
	 */
	async cacheFirst(model, query, opts) {
		return this._cacheFirst(model, query, opts);
	}

	/**
	 * Public wrapper for the private method
	 * It should get the element from cache and if not set in cache then query the database
	 * and set the obj in cache for specified "timeout" seconds
	 */
	async cacheFirstWithTime(model, query, timeout) {
		return this._cacheFirst(model, query, {timeout: timeout});
	}

	/**
	 * Query the database model with the provided query
	 * @param  {String} fields     Fields string separated by " "
	 * @return {Array}       Result returned by the driver
	 */
	async findAll(m, q, fields, opts) {
		if (! opts) {
			opts = {}
		}
		
		let query = this.conn.model(m).find(q, fields);
		_.each(['skip', 'sort', 'limit', 'maxTimeMS'], (o) => {
			let val = opts[o] || null;
			if (val) {
				query[o](val);
			}
		});
		return query.lean().exec();
	}

	/**
	 * Check the cache for the object by making the unique cache if not found then
	 * Query the database model with the provided query and also set the obj in cache
	 * @param  {String} f     Fields string separated by " "
	 * @param  {Number} t     Time in seconds for the which the object is to be cached if found
	 */
	async _cacheAll(m, q, f, t) {
		let cacheKey = this.getCacheKey(m, q, f) + "_all";	// add suffix so as to distinguish between cache first and cache-all key if rest of parameters are the same
		let {cacheObj, error} = await this.cache.getv2(cacheKey);
		if (cacheObj === undefined) {
			cacheObj = await this.findAll(m, q, f);
			await this.cache.set(cacheKey, cacheObj, t);
		}
		return cacheObj;
	}

	async _cacheAllWithOpts(m, q, f, o) {
		let cacheKey = this.getCacheKeyWithOpts(m, q, f, o) + "_all";	// add suffix so as to distinguish between cache first and cache-all key if rest of parameters are the same
		let {cacheObj, error} = await this.cache.getv2(cacheKey);
		if (cacheObj === undefined) {
			cacheObj = await this.findAll(m, q, f, o);
			await this.cache.set(cacheKey, cacheObj, o.timeout || 10000);
		}
		return cacheObj;
	}

	/**
	 * Public wrapper for the private method
	 */
	async cacheAll(model, query, fields) {
		return this._cacheAll(model, query, fields);
	}

	/**
	 * Public wrapper for the private method
	 * It should get the elements from cache and if not set in cache then query the database
	 * and set the obj in cache for specified "timeout" seconds
	 */
	async cacheAllWithTime(model, query, fields, timeout) {
		return this._cacheAll(model, query, fields, timeout);
	}

	async cacheAllWithOpts(model, query, fields, opts) {
		return this._cacheAllWithOpts(model, query, fields, opts);
	}

	/**
	 * Call this function to close the connection to the database
	 * @return {Bool}
	 */
	close() {
		if (this.conn) {
			this.conn.close();
			return true;
		}
		return false;
	}
}

function convertQueryToStr(query) {
	let dupQuery = {};
	_.each(query, (v, k) => {
		if (typeof v == "object" && v instanceof RegExp) {
			dupQuery[k] = v.toString();
		} else {
			dupQuery[k] = v;
		}
	});
	return JSON.stringify(dupQuery);
}

module.exports = Db;

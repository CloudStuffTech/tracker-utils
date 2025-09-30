let util = require('util');
let mongoose = require('mongoose');
let _ = require('lodash');

class DbUtil {
	/**
	 * Connection String method makes a mongodb connection string based on the config object
	 * @param  {Object} config {host: String, user: String, password: String, options: string, database: String}
	 * @return {String}
	 */
	connectionStr(config) {
		let str;
		
		if (config.url) {
			str = config.url;
		} else {
			if (config.host.includes('.mongodb.net')) {
				if (_.size(config.user) == 0) {
					str = util.format('mongodb+srv://%s/%s?%s', config.host, config.database, config.options);
				} else {
					str = util.format('mongodb+srv://%s:%s@%s/%s?%s', config.user, config.password, config.host, config.database, config.options);
				}
			} else {
				// Traditional MongoDB connection
				if (_.size(config.user) == 0) {
					str = util.format('mongodb://%s/%s?%s', config.host, config.database, config.options);
				} else {
					str = util.format('mongodb://%s:%s@%s/%s?%s', config.user, config.password, config.host, config.database, config.options);
				}
			}
		}
		
		return str;
	}

	async createConnection(config) {
		let str = this.connectionStr(config);
		return await mongoose
					.set('strictQuery', false) // needed in mongoose 6 for backward compatibility with mongoose 4 and 5.
											   // strictQuery is default to false from mongoose 7 onwards
					.createConnection(str, {maxPoolSize: config.poolSize || config.maxPoolSize || 5})
					.asPromise();
	}

	generateMongoId() {
		return mongoose.Types.ObjectId();
	}

	convertToMongoId(id) {
		return new mongoose.Types.ObjectId(id);
	}
}

module.exports = new DbUtil;

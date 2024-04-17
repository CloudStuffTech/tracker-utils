let PubSub = require('./pubsub');

class Factory {
	/**
	 * This method will return the PubSub class object
	 * @param {String} messagingType Message Type variable
	 * @param {Object} config Config object
	 * @returns {PubSub}
	 */
	make(messagingType, config) {
		switch (messagingType) {
			case "pubsub":
				let obj = new PubSub(config);
				return obj;
		}
		throw new Error("Invalid Messaging Type");
	}
}

module.exports = new Factory;

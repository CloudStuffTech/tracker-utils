const { Kafka } = require("kafkajs");
const os = require("os");

const kafka = (() => {
	let kafkaClient = null;

	const init = (config) => {
		// Initializing Kafka Client
		if (kafkaClient === null) {
			kafkaClient = new Kafka({
				clientId: config.clientId || os.hostname(),
				brokers: config.brokers
			});
		}
	}

	const createProducer = (config) => {
		if (kafkaClient === null) return null;
		
		const {
			createPartitioner = null,
			retry = null,
			metadataMaxAge = 300000, //5 minutes
			allowAutoTopicCreation = false,
			transactionTimeout = 30000,
			idempotent = false,
			maxInFlightRequests = null
		} = config;

		const producer = kafkaClient.producer({
			createPartitioner,
			retry,
			metadataMaxAge, //5 minutes
			allowAutoTopicCreation,
			transactionTimeout,
			idempotent,
			maxInFlightRequests
		})

		return producer
	}

	return { init, createProducer }
})()

module.exports = { kafka }

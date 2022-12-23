const { Kafka } = require("kafkajs");
const os = require("os");

const kafka = () => {
	let kafkaClient = null;
	let producer = null;

	const init = (config) => {
		// Initializing Kafka Client
		if (kafkaClient === null) {
			kafkaClient = new Kafka({
				clientId: config.clientId || os.hostname(),
				brokers: config.brokers
			});
		}
	}

	const createProducer = ({
		createPartitioner = null,
		retry = null,
		metadataMaxAge = 300000, //5 minutes
		allowAutoTopicCreation = false,
		transactionTimeout = 30000,
		idempotent = false,
		maxInFlightRequests = null
	}) => {
		if (kafkaClient === null) return null;

		if (producer === null) {
			producer = kafkaClient.producer({
				createPartitioner,
				retry,
				metadataMaxAge, //5 minutes
				allowAutoTopicCreation,
				transactionTimeout,
				idempotent,
				maxInFlightRequests
			})
		}

	}

	const connectProducer = async () => {
		if (producer) await producer.connect()
	}

	const disconnectProducer = async () => {
		if (producer) await producer.disconnect()
	}

	return { init, createProducer, connectProducer, disconnectProducer }
}

module.exports = { kafka }

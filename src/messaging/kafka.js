const { Kafka } = require("kafkajs");
const os = require("os");

// Todo:- option to reuse existing client
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
		createPartitioner = undefined,
		retry = undefined,
		metadataMaxAge = 300000, //5 minutes
		allowAutoTopicCreation = false,
		transactionTimeout = 30000,
		idempotent = false,
		maxInFlightRequests = undefined
	} = {}) => {
		if (kafkaClient === null) return false;

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
		if (!producer) {
			return false;
		}
		await producer.connect();
	}

	const disconnectProducer = async () => {
		if (!producer) {
			return false
		}
		await producer.disconnect()
	}

	const send = async ({ messages, topic }) => {
		if (!producer) {
			return false;
		}
		await producer.send({ topic, messages, });
	}

	return { init, createProducer, connectProducer, disconnectProducer, send }
}

module.exports = { kafka }

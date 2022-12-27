const { Kafka } = require("kafkajs");
const os = require("os");

const kafka = () => {
	let kafkaClient = null;
	let producer = null;
	let consumer = null;

	// Init will initialise kafka client
	const init = (config) => {
		if (kafkaClient === null) {
			kafkaClient = new Kafka({
				clientId: config.clientId || os.hostname(),
				brokers: config.brokers,
			});
		}
	};

	// Create Producer
	const createProducer = ({
		createPartitioner = undefined,
		retry = undefined,
		metadataMaxAge = 300000, //5 minutes
		allowAutoTopicCreation = false,
		transactionTimeout = 30000,
		idempotent = false,
		maxInFlightRequests = undefined,
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
				maxInFlightRequests,
			});
		}
	};

	// Connect producer, producer must exists(use createProducer).
	const connectProducer = async () => {
		if (!producer) {
			return false;
		}
		await producer.connect();
	};

	// Disconnect producer, producer must exists(use connectProducer).
	const disconnectProducer = async () => {
		if (!producer) {
			return false;
		}
		await producer.disconnect();
	};

	// Send message, Producer must be connected(use connectProducer).
	const send = async ({ topic, messages }) => {
		if (!producer) {
			return false;
		}
		await producer.send({ topic, messages });
	};

	// Create Consumer
	const createConsumer = ({ groupId }) => {
		if (consumer) {
			return false;
		}
		consumer = kafkaClient.consumer({ groupId });
	};

	// Connect consumer, consumer must exists(use createConsumer).
	const connectConsumer = async () => {
		await consumer.connect();
	};

	// Disconnect consumer, producer must exists(use connectConsumer).
	const disconnectConsumer = async () => {
		if (!consumer) {
			return false;
		}
		await consumer.disconnect();
	};

	// Subscribe consumer, consumer must be connected(use connectConsumer).
	const subscribeConsumer = async ({ topic, fromBeginning = false }) => {
		if (!consumer) {
			return false;
		}
		await consumer.subscribe({ topic, fromBeginning });
	};

	// Handle messages from subscribed consumer
	const handlConsumerMsg = async ({ eachMessageHandler, batchMessageHandler, eachBatchAutoResolve = false }) => {
		if (eachMessageHandler) {
			await consumer.run({
				eachMessage: eachMessageHandler,
			});
		} else {
			await consumer.run({
				eachBatchAutoResolve,
				eachBatch: batchMessageHandler,
			});
		}
	};

	// Handle shutdown gracefully
	const handleConmsumerShutdown = ({
		signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"],
		errorTypes = ["unhandledRejection", "uncaughtException"],

		disconnectOnInterupt = true,
		disconnectOnError = false,
	} = {}) => {
		if (disconnectOnInterupt) {
			errorTypes.forEach((type) => {
				process.on(type, async (e) => {
					try {
						console.log(`process.on ${type}`);
						console.error(e);
						await consumer.disconnect();
						process.exit(0);
					} catch (_) {
						process.exit(1);
					}
				});
			});
		}

		if (disconnectOnError) {
			signalTraps.forEach((type) => {
				process.once(type, async () => {
					try {
						await consumer.disconnect();
					} finally {
						process.kill(process.pid, type);
					}
				});
			});
		}
	};
	// Handle shutdown gracefully for producer
	const handleProducerShutdown = ({
		signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"],
		errorTypes = ["unhandledRejection", "uncaughtException"],

		disconnectOnInterupt = true,
		disconnectOnError = false,
	} = {}) => {
		if (disconnectOnInterupt) {
			errorTypes.forEach((type) => {
				process.on(type, async (e) => {
					try {
						console.log(`process.on ${type}`);
						console.error(e);
						await producer.disconnect();
						process.exit(0);
					} catch (_) {
						process.exit(1);
					}
				});
			});
		}

		if (disconnectOnError) {
			signalTraps.forEach((type) => {
				process.once(type, async () => {
					try {
						await producer.disconnect();
					} finally {
						process.kill(process.pid, type);
					}
				});
			});
		}
	};

	return {
		init,
		createProducer,
		connectProducer,
		disconnectProducer,
		send,
		createConsumer,
		connectConsumer,
		disconnectConsumer,
		subscribeConsumer,
		handlConsumerMsg,
		handleConmsumerShutdown,
		handleProducerShutdown
	};
}

module.exports = { kafka }

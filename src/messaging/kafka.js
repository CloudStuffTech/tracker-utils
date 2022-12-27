const { Kafka } = require("kafkajs");
const os = require("os");

const kafka = () => {
	let kafkaClient = null;
	let producer = null;
	let consumer = null;

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

	const send = async ({ topic, messages }) => {
		if (!producer) {
			return false;
		}
		await producer.send({ topic, messages, });
	}

	const createConsumer = ({ groupId }) => {
		if (consumer) {
			return false
		}
		consumer = kafkaClient.consumer({ groupId });
	}
	const connectConsumer = async () => {
		await consumer.connect();

	}

	const subscribeConsumer = async ({ topic, fromBeginning = false, }) => {
		if (!consumer) {
			return false
		}
		await consumer.subscribe({ topic, fromBeginning, })
	}

	const handlConsumerMsg = async ({ eachMessageHandler, batchMessageHandler, eachBatchAutoResolve = false }) => {
		if (eachMessageHandler) {
			await consumer.run({
				eachMessage: eachMessageHandler,
			})
		} else {
			await consumer.run({
				eachBatchAutoResolve,
				eachBatch: batchMessageHandler,
			})
		}
	}

	const handleConmsumerShutdown = ({
		signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'],
		errorTypes = ['unhandledRejection', 'uncaughtException'],

		disconnectOnInterupt = true,
		disconnectOnError = true,

	} = {}) => {

		if (disconnectOnInterupt) {
			errorTypes.forEach(type => {
				process.on(type, async e => {
					try {
						console.log(`process.on ${type}`)
						console.error(e)
						await consumer.disconnect()
						process.exit(0)
					} catch (_) {
						process.exit(1)
					}
				})
			})
		}

		if (disconnectOnError) {
			signalTraps.forEach(type => {
				process.once(type, async () => {
					try {
						await consumer.disconnect()
					} finally {
						process.kill(process.pid, type)
					}
				})
			})
		}
	}

	return {
		init, createProducer, connectProducer, disconnectProducer, send, createConsumer,
		connectConsumer, subscribeConsumer, handlConsumerMsg, handleConmsumerShutdown
	}
}

module.exports = { kafka }

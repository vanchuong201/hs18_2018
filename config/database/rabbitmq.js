const config = require('../env')
const open = require('amqplib').connect(config.RABBITMQ);

const channel = exports.channel = open.then(function (conn) {
		console.log('rabbitmq is well')
		return conn.createChannel();
	})
	.catch(ex => {
		console.log('rabbitmq connection refused', ex.message)
	})

exports.publish = async function (queueName, message) {
	return channel.then(function (ch) {
		return ch.assertQueue(queueName).then(function (ok) {
			return ch.sendToQueue(queueName, new Buffer(message));
		});
	})
}

exports.subcribe = async function (queueName) {
	return channel.then(function (ch) {
		return ch.assertQueue(queueName)
			.then(function (ok) {
				return ch.consume(queueName, function (msg) {
					if (msg !== null) {
						ch.ack(msg)
						return msg
					}
					return null
				})
			})
	})
}
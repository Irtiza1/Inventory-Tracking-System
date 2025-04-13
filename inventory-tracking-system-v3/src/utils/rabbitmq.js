const amqp = require('amqplib');
const { RABBITMQ_URL } = require('../db/database');

let channel;

async function setupRabbitMQ() {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  
  // Assert queues
  await channel.assertQueue('audit_logs', { durable: true });
  await channel.assertQueue('audit_logs_bulk', { durable: true });
  
  console.log('RabbitMQ connected');
}

async function publishToQueue(queue, data) {
  if (!channel) await setupRabbitMQ();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
}

module.exports = {
  setupRabbitMQ,
  publishToQueue
};
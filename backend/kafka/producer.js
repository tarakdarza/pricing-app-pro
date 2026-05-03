const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "pricing-app",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
}

async function sendEvent(topic, message) {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message)
      }
    ]
  });
}

module.exports = {
  connectProducer,
  sendEvent
};
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "pricing-app-consumer",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({
  groupId: "product-events-group"
});

async function startConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "product-events",
    fromBeginning: true
  });

  console.log("✅ Kafka Consumer connected");
  console.log("👂 Listening to product-events...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      logger.info({
      action: "KAFKA_EVENT_RECEIVED",
      event
});
    }
  });
}

startConsumer().catch(console.error);
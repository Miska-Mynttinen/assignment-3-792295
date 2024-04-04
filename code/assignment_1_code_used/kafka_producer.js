require('axios');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'mysimbdp',
    brokers: ['192.168.1.97:9092', '192.168.1.97:9093', '192.168.1.97:9094'],
    //brokers: ['192.168.208.3:9092', '192.168.208.5:9093', '192.168.208.6:9094']
    //brokers: ['kafka0:9092', 'kafka1:9093', 'kafka2:9094']
    //brokers: ['kafka0', 'kafka1', 'kafka2']
    //brokers: ['9092', '9093', '9094']
    //brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
});

const produce = async (topic, messages) => {
    const producer = kafka.producer();
    try {
        await producer.connect();
        await producer.send({
            topic: topic,
            messages: messages,
        });
    } catch (error) {
        console.error(error);
    } finally {
        await producer.disconnect();
    }
};

module.exports = produce;
require('axios');
const { Kafka } = require('kafkajs');
// const { create } = require('./dataService');
const { create } = require('../database_api/tenantService');


const kafka = new Kafka({
    clientId: 'mysimbdp',
    brokers: ['192.168.1.97:9092', '192.168.1.97:9093', '192.168.1.97:9094'],
    //brokers: ['192.168.208.3:9092', '192.168.208.5:9093', '192.168.208.6:9094']
    //brokers: ['kafka0:9092', 'kafka1:9093', 'kafka2:9094']
    //brokers: ['kafka0', 'kafka1', 'kafka2']
    //brokers: ['9092', '9093', '9094']
    //brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
});

const consume = async (topic, groupId) => {
    const consumer = kafka.consumer({ groupId: groupId });
    const createPromises = [];
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString())
                const createResult = create(data);
                createPromises.push(createResult);
            },
        });
    } catch (error) {
        console.error(error);
    }

    // Return consumer in order to disconnect with consumer.disconnect()
    return [consumer, createPromises];
};

module.exports = consume;

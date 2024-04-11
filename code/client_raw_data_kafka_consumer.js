require('axios');
const { Kafka } = require('kafkajs');
const { ingestData } = require('./mysimbdp-daas')


const kafka = new Kafka({
    clientId: 'mysimbdp',
    brokers: ['192.168.1.97:9092', '192.168.1.97:9093', '192.168.1.97:9094']
});

const consume = async (tenantId, topic, groupId) => {
    const consumer = kafka.consumer({ groupId: groupId });
    const createPromises = [];
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString());
                const wrangledData = wrangleData(tenantId, data);
                const createResult = ingestData(wrangledData);
                createPromises.push(createResult);
            },
        });
    } catch (error) {
        console.error(error);
    }

    // Return consumer in order to disconnect with consumer.disconnect()
    return [consumer, createPromises];
};

const wrangleData = (tenantId, data) => {
    // If data is not an array, wrap it in an array
    const dataArray = Array.isArray(data) ? data : [data];
    // Add tenantId and timestamp to all files in data
    const wrangledData = dataArray.map(file => {
        // Create a new object with tenantId added
        return { ...file, tenantId: tenantId, timestamp: new Date() };
    });

    return wrangledData;
}

module.exports = consume;

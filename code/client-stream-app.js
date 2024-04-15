const { ingestData, streamProcess } = require('./mysimbdp-daas.js')
const consume = require('./client_raw_data_kafka_consumer.js');

const readFiles = async (tenantId, dataId, streamInput) => {
    // Read data from JSON file as an example
    await streamInput.giveDataToTenant(tenantId, dataId);
}

/*const testIngestionPerformance = (tenantId, data, constraints) => {
    const startTime = Date.now() * 1000; // in seconds
    
    // Ingest the data
    ingestTenantData(tenantId, data, constraints)
        .then(() => {
        const endTime = Date.now() * 1000;
        const duration = endTime - startTime; // in seconds
        const dataSize = data.length; // in bytes
        const speed = dataSize / duration; // in bytes per second
    
        console.log(`Ingestion speed for tenant ${tenantId}: ${speed} bytes/s`);
        })
        .catch(error => {
        console.error(`Ingestion failed for tenant ${tenantId}: ${error.message}`);
        });
}*/

const clientstreamingest = async (tenantId, dataId, streamInput) => {
    await readFiles(tenantId, dataId, streamInput);
    /* let consumer;
    let createResults;

    try {
        // Consume data from Kafka topic at stream-input
        const consumerObj = await consume(tenantId, `${tenantId}-topic`, `${tenantId}-group`);
        // Consumer
        consumer = consumerObj[0];
        // POST request return results
        createResults = consumerObj[1];
        success = true;
    } catch (error) {
        console.error(error);
        await consumer.disconnect();
    } finally {
        if (consumer) {
            // Disconnect consumer When POST promises have resolved
            // Wait for 100ms before checking again
            while (createResults && createResults.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            await consumer.disconnect();
        }
    } */

    /* Process, aggregate and ingest processed data with Spark stream-processor by calling it's api in mysimbdp */
    // streamProcess(tenantId, `${tenantId}-topic`);
}

module.exports = { clientstreamingest };
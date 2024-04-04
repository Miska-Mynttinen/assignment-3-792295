require('axios');
const { create } = require('./database_api/tenantService.js')
const { createLog } = require('./logger.js')
// const { getAll, getOne } = require('./database_api/tenantService.js');
const produce = require('./assignment_1_code_used/kafka_producer.js');
const consume = require('./assignment_1_code_used/kafka_consumer.js');
const { runPythonScript } = require('./run_python_script.js');

const ingestData = async (tenantId, data) => {
    let success;
    let consumer;
    let createResults;
    let metrics = {};
    metrics.dataSizeBytes = Buffer.byteLength(JSON.stringify(data));
    metrics.ingestionStartTime = new Date;
    try {
        // Produce data to Kafka topic
        // await produce(`${tenantId}-topic`, [{ value: JSON.stringify(data) }]);
        const messages = data.map(message => ({ value: JSON.stringify(message) }));
        await produce(`${tenantId}-topic`, messages);

        // Consume data from Kafka topic
        const consumerObj = await consume(`${tenantId}-topic`, `${tenantId}-group`);
        // Consumer
        consumer = consumerObj[0];
        // POST request return results
        createResults = consumerObj[1];
        success = true;
    } catch (error) {
        console.error(error);
        metrics.ingestionEndTime = new Date;
        metrics.ingestionResult = `Raw data: Fail: ${error}`;
        metrics.timestamp = new Date;
        await createLog(tenantId, metrics);
        await consumer.disconnect();
        success = false;
    } finally {
        if (consumer) {
            // Disconnect consumer When POST promises have resolved
            // Wait for 100ms before checking again
            while (createResults && createResults.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            if (success) {
                metrics.ingestionEndTime = new Date;
                metrics.ingestionResult = 'Raw data: Success';
                metrics.timestamp = new Date;
                await createLog(tenantId, metrics);
            }

            await consumer.disconnect();
        }
    }
}

const batchProcess = async (tenantId, files) => {
    let metrics = {};
    metrics.dataSizeBytes = Buffer.byteLength(JSON.stringify(files));
    metrics.ingestionStartTime = new Date;
    const processedData = await runPythonScript(files);
    // id is only for testing for now
    const dataToStore = {
        id: String(processedData[0]),
        tenantId: tenantId,
        timestamp: files[0].timestamp,
        temperature: String(processedData[0]),
        humidity: String(processedData[1])
    }
    try {
        await create(dataToStore);
        metrics.ingestionEndTime = new Date;
        metrics.ingestionResult = 'Process data: Success';
        metrics.timestamp = new Date;
        await createLog(tenantId, metrics);
    } catch (error) {
        metrics.ingestionEndTime = new Date;
        metrics.ingestionResult = `Process data: Fail: ${error}`;
        metrics.timestamp = new Date;
        await createLog(tenantId, metrics);
    }
}

module.exports = { ingestData, batchProcess }
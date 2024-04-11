require('axios');
const { create } = require('./database_api/tenantService.js')
const { createLog } = require('./logger.js')
const { runPythonScript } = require('./run_python_script.js');

const ingestData = async (dataToStore) => {
    await create(dataToStore);
}

const streamProcess = async (tenantId, topic, group) => {
    let metrics = {};
    metrics.ingestionStartTime = new Date;
    const processedData = await runPythonScript(topic, group);

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
        metrics.ingestionResult = 'Stream process data: Success';
        metrics.timestamp = new Date;
        await createLog(tenantId, metrics);
    } catch (error) {
        metrics.ingestionEndTime = new Date;
        metrics.ingestionResult = `Stream process data: Fail: ${error}`;
        metrics.timestamp = new Date;
        await createLog(tenantId, metrics);
    }
}

module.exports = { ingestData, streamProcess }
// Many Kafka Producers (one for each message) and Kafka Consumers are accessing the concurrent mysimbdp-dataingest writing data into mysimbdp-coredms
const fs = require('fs').promises;
const path = require('path');
require('axios');
const { getTestSourceData } = require('../dataService.js');
const produce = require('../kafka_producer.js');
const consume = require('../kafka_consumer.js');

async function runPerformanceTest() {
    const testData = await getTestSourceData();
    const testDataLength = testData.length;
    const iterationTimes = [];
    const consumers = {};
    
    for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        const startIndex = Math.floor((i * 0.1) * testDataLength);
        const endIndex = Math.floor(((i + 1) * 0.1) * testDataLength);

        console.log('\nstartIndex', startIndex);
        console.log('\nendIndex', endIndex);
        for (let j = startIndex; j < endIndex; j++) {
            await produce(`test-topic${i}`, [{ value: JSON.stringify(testData[j]) }]);

            if (j === startIndex) {
                console.log('Starting consumers');
                //Change the amount of these to have more ingestors running at the same time (disconnect later)
                consumers[`consumer${i}_1`] = await consume(`test-topic${i}`, 'test-group');
                consumers[`consumer${i}_2`] = await consume(`test-topic${i}`, 'test-group');
                consumers[`consumer${i}_3`] = await consume(`test-topic${i}`, 'test-group');
            }
        }

        // Wait for data to be ingested into MongoDB
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const endTime = Date.now();
        const iterationTime = endTime - startTime;
        iterationTimes.push(iterationTime);

        //DISCONNECT HERE
        await consumers[`consumer${i}_1`].disconnect();
        await consumers[`consumer${i}_2`].disconnect();
        await consumers[`consumer${i}_3`].disconnect();
    }
    
    await saveIterationTimes(iterationTimes);
}

async function saveIterationTimes(iterationTimes) {
    const relativeFilePath = path.join(__dirname, 'performance_ingest.json');
    await fs.writeFile(relativeFilePath, JSON.stringify(iterationTimes));
}

// Run the performance test
runPerformanceTest()
    .then(() => console.log('Performance test completed successfully'))
    .catch(error => console.error('Performance test failed:', error));
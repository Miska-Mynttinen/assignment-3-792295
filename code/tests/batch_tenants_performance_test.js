const fs = require('fs').promises;
const path = require('path');
const { inputDirectory } = require('../index.js')
// const { getTestSourceData } = require('../database_api/tenantService.js');

async function runPerformanceTest() {
    // const sourceData = await getTestSourceData();
    /* transform JSON data to array indexes of JSON data in an array */
    // Generate test data
    const sourceData = [];
    const numberOfDataPoints = 10; // Change this number to generate more data points
    for (let i = 0; i < numberOfDataPoints; i++) {
        sourceData.push(generateRandomData());
    }

    let testData;

    if (sourceData.length === 1) {
        testData = Object.values(sourceData.reduce((acc, obj) => {
            let key = obj['id'];
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {}));
    } else {
        testData = sourceData;
    }
    
    const testDataLength = testData.length;
    await saveSourceDataSize(sourceData)
    const iterationTimes = [];
    
    // Prepare two sets of iterations
    const iterations = [
        { startPercentage: 0, endPercentage: 0.4, tenant: '1' },
        { startPercentage: 0.6, endPercentage: 1.0, tenant: '2' }
    ];

    const fullStartTime = Date.now();

    // Execute iterations concurrently
    await Promise.all(iterations.map(async ({ startPercentage, endPercentage, tenant }) => {
        const startTime = Date.now();
        const startIndex = Math.floor(startPercentage * testDataLength);
        const endIndex = Math.floor(endPercentage * testDataLength);
        console.log('\nstartIndex', startIndex);
        console.log('\nendIndex', endIndex);
        for (let i = startIndex; i < endIndex; i++) {
            await inputDirectory.putFilesIntoInputDirectory(testData[i], tenant);
        }
        const endTime = Date.now();
        const iterationTime = endTime - startTime; // milliseconds
        iterationTimes.push(iterationTime);
    }));
    
    await saveIterationTimes(iterationTimes);

    const fullEndTime = Date.now();

    await saveFullIterationTime(fullEndTime - fullStartTime);
}

async function saveIterationTimes(iterationTimes) {
    const relativeFilePath = path.join(__dirname, 'batch_tenants_performance_test.json');
    await fs.writeFile(relativeFilePath, JSON.stringify(iterationTimes));
}

async function saveFullIterationTime(iterationTimes) {
    const relativeFilePath = path.join(__dirname, 'batch_tenants_full_performance_time.json');
    await fs.writeFile(relativeFilePath, JSON.stringify(iterationTimes));
}

async function saveSourceDataSize(sourceData) {
    const relativeFilePath = path.join(__dirname, 'batch_tenants_performance_source_data_size.json');

    // Calculate the size of the array in bytes
    const sizeInBytes = Buffer.byteLength(JSON.stringify(sourceData));

    // Save the size to the file
    await fs.writeFile(relativeFilePath, JSON.stringify({ sizeInBytes }));
}

function generateRandomData() {
    const randomNumber = Math.random() * 100;
    const randomTemperature = (Math.random() * 50 - 20).toFixed(2);
    const randomHumidity = (Math.random() * 100).toFixed(2);
    const randomPressure = (Math.random() * 200000).toFixed(2);
    return {
        "id": Math.floor(Math.random() * 1000000000000),
        "sampling_rate": null,
        "timestamp": new Date().toISOString(),
        "location": {
            "id": Math.floor(Math.random() * 100000),
            "latitude": (Math.random() * 180 - 90).toFixed(3),
            "longitude": (Math.random() * 360 - 180).toFixed(3),
            "altitude": (Math.random() * 1000).toFixed(1),
            "country": "XX",
            "exact_location": 0,
            "indoor": 0
        },
        "sensor": {
            "id": Math.floor(Math.random() * 100000),
            "pin": Math.floor(Math.random() * 20).toString(),
            "sensor_type": {
                "id": Math.floor(Math.random() * 100),
                "name": "RandomSensor",
                "manufacturer": "RandomManufacturer"
            }
        },
        "sensordatavalues": [
            {
                "id": Math.floor(Math.random() * 1000000000000),
                "value": randomTemperature,
                "value_type": "temperature"
            },
            {
                "id": Math.floor(Math.random() * 1000000000000),
                "value": randomHumidity,
                "value_type": "humidity"
            },
            {
                "id": Math.floor(Math.random() * 1000000000000),
                "value": randomPressure,
                "value_type": "pressure"
            }
        ]
    };
}

// Run the performance test
runPerformanceTest()
    .then(() => console.log('Performance test completed successfully'))
    .catch(error => console.error('Performance test failed:', error));
const { inputDirectory } = require('../../index.js')
// const { getTestSourceData } = require('../../database_api/tenantService.js');

async function runTest() {
    // const sourceData = await getTestSourceData();

    // Generate test data
    const generatedData = [];
    const numberOfDataPoints = 20000; // Change this number to generate more data points
    for (let i = 0; i < numberOfDataPoints; i++) {
        generatedData.push(generateRandomData());
    }

    let jsonData = JSON.stringify(generatedData);

    const fileSize = Buffer.byteLength(jsonData)

    console.log('fileSize:', fileSize); // 7.6MB
    console.log('[jsonData].length', [jsonData].length);

    /* Create a file that is over 5MB and try to ingest it */
    try {
        const returnValue = await inputDirectory.putFilesIntoInputDirectory([jsonData], '2');
        console.log('returnValue: ', returnValue);
        if (returnValue === `A given file is too large. Allowed maximum size in MB is 5`) {
            // Handle the specific error
            console.log('test: batch_tenant2_file_too_large.js PASSED');
        } else {
            console.log('test: batch_tenant2_file_too_large.js FAILED');
        }
    } catch (error) {
        // Check if the error matches
        console.log(error.message);
        if (error.message === `A given file is too large. Allowed maximum size in MB is 5`) {
            // Handle the specific error
            console.log('test: batch_tenant2_file_too_large.js PASSED');
        } else {
            console.log('test: batch_tenant2_file_too_large.js FAILED');
        }
    }
};


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

runTest();
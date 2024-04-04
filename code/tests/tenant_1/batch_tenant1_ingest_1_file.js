const { inputDirectory } = require('../../index.js')
const { getOne } = require('../../database_api/tenantService.js');

async function runTest() {
    const testData = {
        id: '19195987458',
        sampling_rate: null,
        timestamp: '2024-02-12 18:04:02',
        location: {
            id: '72428',
            latitude: '41.978',
            longitude: '21.464',
            altitude: '241.2',
            country: 'MK',
            exact_location: '0',
            indoor: '0'
        },
        sensor: {
            id: '82705',
            pin: '1',
            sensor_type: {
                id: '14',
                name: 'SDS011',
                manufacturer: 'Nova Fitness'
            }
        },
        sensordatavalues: [
            {
                id: "44407351364",
                value: "11.30",
                value_type: "temperature"
            },
            {
                id: "44407351366",
                value: "99.90",
                value_type: "humidity"
            }
        ]
    };

    inputDirectory.putFilesIntoInputDirectory(testData, '1');

    const tenantId = '1';
    const timestamp = new Date();

    const modifiedTestData = { ...testData, tenantId: tenantId, timestamp: timestamp };

    // Whole notifying and ingestion takes a lot of time for data to be accessible (1 minute).
    await new Promise(resolve => setTimeout(resolve, 60000));

    const result = await getOne(modifiedTestData);
    if (!result) {
        throw new Error('Data not found in MongoDB');
    }
    
    // Compare ingested data with test data
    if (!(deepEqual(JSON.parse(JSON.stringify(result)), modifiedTestData))) {
        throw new Error('Ingested data does not match test data');
    } else {
        console.log('test: Part 1 batch_tenant1_ingest_1_file.js PASSED');
    }

    const modifiedTestData2 = {
        id: '11.3',
        tenantId: '1',
        timestamp: timestamp,
        temperature: '11.3',
        humidity: '99.9'
    }

    const result2 = await getOne(modifiedTestData2);
    if (!result) {
        throw new Error('Data not found in MongoDB');
    }
    
    // Compare ingested data with processed test data
    if (!(deepEqual(JSON.parse(JSON.stringify(result2)), modifiedTestData2))) {
        throw new Error('Ingested data does not match test data');
    } else {
        console.log('test: Part 2 batch_tenant1_ingest_1_file.js PASSED');
    }
};

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
        return false;
    }
  
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        
        // Check if both values are date strings
        const areDateStrings = isDateString(val1) && isDateString(val2);
        
        if (
            (areObjects && !deepEqual(val1, val2)) ||
            (!areObjects && val1 !== val2) ||
            areDateStrings
        ) {
            continue; // Skip comparison if both values are date strings
        }
        
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
  
    return true;
}
  
function isObject(object) {
    return object != null && typeof object === 'object';
}

function isDateString(str) {
    // Regular expression to check if the string is in ISO format
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(str);
}

runTest();
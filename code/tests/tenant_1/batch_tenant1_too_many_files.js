const { inputDirectory } = require('../../index.js')
// const { getTestSourceData } = require('../../assignment_1_code_used/dataService.js');
const files_12 = require('./tenant_1_test_files/file_12_JSON_files.json');

async function runTest(sourceData) {
    //const sourceData = await getTestSourceData();

    /* transform JSON data to array indexes of JSON data in an array */
    let dataArray = Object.values(sourceData.reduce((acc, obj) => {
        let key = obj['id'];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {}));

    // Limit is 10 files a a time so 11 should cause an error
    const tooManyFiles = dataArray.slice(0, 11);

    console.log('tooManyFiles.length', tooManyFiles.length);

    try {
        const returnValue = await inputDirectory.putFilesIntoInputDirectory(tooManyFiles, '1');
        console.log('returnValue:', returnValue)
        if (returnValue === `Too many files inserted at once. Allowed maximum: 10`) {
            // Handle the specific error
            console.log('test: batch_tenant1_too_many_files.js PASSED');
        } else {
            console.log('test: batch_tenant1_too_many_files.js FAILED');
        }
    } catch (error) {
        // Check if the error matches
        console.log(error.message);
        if (error.message === `Too many files inserted at once. Allowed maximum: 10`) {
            // Handle the specific error
            console.log('test: batch_tenant1_too_many_files.js PASSED');
        } else {
            console.log('test: batch_tenant1_too_many_files.js FAILED');
        }
    }
};

runTest(files_12);
const fs = require('fs');
const path = require('path');

// Function to read all files in a directory and push them into an array
function readFilesInDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            const fileArray = [];

            files.forEach(file => {
                const filePath = path.join(directoryPath, file);
                fileArray.push(filePath);
            });

            resolve(fileArray);
        });
    });
}

module.exports = { readFilesInDirectory };
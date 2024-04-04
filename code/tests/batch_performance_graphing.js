const fs = require('fs').promises;
const path = require('path');
const nodeplotlib = require('nodeplotlib');

async function loadTimeValuesFromFile(name) {
    try {
        const relativeFilePath = path.join(__dirname, name);
        const data = await fs.readFile(relativeFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

function convertMillisecondsToSeconds(values) {
    return values.map(value => value / 1000); // Divide each value by 1000 to convert milliseconds to seconds
}

async function plotGraph() {
    try {
        const values3 = await loadTimeValuesFromFile('performance_3_ingest.json');
        


        const values7 = await loadTimeValuesFromFile('performance_7_ingest.json');



        const values10 = await loadTimeValuesFromFile('performance_10_ingest.json');

        const values3InSeconds = convertMillisecondsToSeconds(values3);
        const values7InSeconds = convertMillisecondsToSeconds(values7);
        const values10InSeconds = convertMillisecondsToSeconds(values10);

        const data = [
            {
                x: Array.from({ length: values3InSeconds.length }, (_, i) => i + 1),
                y: values3InSeconds,
                type: 'scatter',
                name: 'Performance 3 ingestions at a time'
            },
            {
                x: Array.from({ length: values7InSeconds.length }, (_, i) => i + 1),
                y: values7InSeconds,
                type: 'scatter',
                name: 'Performance 7 ingestions at a time'
            },
            {
                x: Array.from({ length: values10InSeconds.length }, (_, i) => i + 1),
                y: values10InSeconds,
                type: 'scatter',
                name: 'Performance 10 ingestions at a time'
            }
        ];

        nodeplotlib.plot(data);
    } catch (error) {
        console.error('Error plotting graph:', error);
    }
}

plotGraph();

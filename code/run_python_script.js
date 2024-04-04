const { spawn } = require('child_process');

// Run a Python script and return output, args are the given JSON items in an array
function runScript(args, scriptPath) {
  return new Promise((resolve, reject) => {
    // Convert JSON items to strings
    const jsonStringArgs = args.map(JSON.stringify);

    // Use child_process.spawn method from 
    // child_process module and assign it to variable
    const pyProg = spawn('./.venv/bin/python3', [scriptPath, ...jsonStringArgs]);

    // Collect data from script and store it in an array
    let data = [];

    // Capture stdout data
    pyProg.stdout.on('data', (stdout) => {
      data.push(stdout.toString());
    });

    // Capture stderr data (if any)
    pyProg.stderr.on('data', (stderr) => {
      console.log(`stderr: ${stderr}`);
    });

    // When script is finished, resolve the promise with the collected data
    pyProg.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      const output = data.join(''); // Concatenate data array into a single string

      // Parse the output string into average temperature and humidity
      const [avgTempStr, avgHumidityStr] = output.trim().split('\n');
      const avgTemp = parseFloat(avgTempStr.split(':')[1].trim());
      const avgHumidity = parseFloat(avgHumidityStr.split(':')[1].trim());

      resolve({ avgTemp, avgHumidity });
    });

    // Handle any errors
    pyProg.on('error', (err) => {
      reject(err);
    });
  });
}

async function runPythonScript(files) {
  try {
    const { avgTemp, avgHumidity } = await runScript(files, './sparkProcessor.py');
    console.log('Average Temperature:', avgTemp);
    console.log('Average Humidity:', avgHumidity);
    console.log('Success');
    return [avgTemp, avgHumidity];
  } catch (error) {
    console.error('Error running Python script:', error);
    throw error; // Re-throw error to propagate it
  }
}

// Export the function
module.exports = { runPythonScript };

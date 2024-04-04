const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    id: String,
    sampling_rate: String,
    timestamp: String,
    location: {
      id: String,
      latitude: String,
      longitude: String,
      altitude: String,
      country: String,
      exact_location: String,
      indoor: String
    },
    sensor: {
      id: String,
      pin: String,
      sensor_type: {
        id: String,
        name: String,
        manufacturer: String
      }
    },
    sensordatavalues: [{
      id: String,
      value: String,
      value_type: String
    }]
});

dataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v

    // Remove _id field from each object within the sensordatavalues array
    if (returnedObject.sensordatavalues && Array.isArray(returnedObject.sensordatavalues)) {
      returnedObject.sensordatavalues.forEach(sensorData => {
        delete sensorData._id;
      });
    }
  }
})

module.exports = mongoose.model('Data', dataSchema)
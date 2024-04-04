const mongoose = require('mongoose')

const tenantSchema = new mongoose.Schema({
    tenantId: String,
    freeform_data: mongoose.Schema.Types.Mixed
});

tenantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v

    // Flatten freeform_data
    if (returnedObject.freeform_data && typeof returnedObject.freeform_data === 'object') {
        for (const key in returnedObject.freeform_data) {
          returnedObject[key] = returnedObject.freeform_data[key];
        }
        delete returnedObject.freeform_data;
    }

    // Remove _id field from each object within the sensordatavalues array
    // Used to test that one file is the same for tenant1
    if (returnedObject.sensordatavalues && Array.isArray(returnedObject.sensordatavalues)) {
        returnedObject.sensordatavalues.forEach(sensorData => {
          delete sensorData._id;
        });
    }
  }
})

module.exports = mongoose.model('Tenant', tenantSchema)
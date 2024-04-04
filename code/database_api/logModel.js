const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    tenantId: String,
    freeform_data: mongoose.Schema.Types.Mixed
});

logSchema.set('toJSON', {
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
  }
})

module.exports = mongoose.model('Log', logSchema)
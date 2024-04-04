const mongoose = require('mongoose')

const agreementSchema = new mongoose.Schema({
    tenantId: String,
    paymentGroup: String,
    data_file_constraints: {
      file_format: String,
      max_num_of_files: String,
      max_file_size_megabytes: String
    },
    service_agreement_constraints: {
      agreement_duration_months: String,
      cost_per_MB_in_euro: String,
      service_availability_in_percent: String
    }
});

agreementSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Agreement', agreementSchema)
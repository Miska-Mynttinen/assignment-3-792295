// Catches http requests from client-side mysimbdp-daas API calls and is part of mysimbdp-Agreementingest
require('axios');
const logRouter = require('express').Router()
require('dotenv').config()

const Log = require('./logModel.js');

logRouter.post('/:tenantId/', async (request, response) => {
  const body = request.body

  // Construct freeform_data by excluding tenantId
  const { tenantId: _, ...freeform_data } = body;

  const log = new Log({
    tenantId: body.tenantId,
    freeform_data: freeform_data
  });

  const savedLog = await log.save()
  response.status(201).json(savedLog)
});


module.exports = logRouter
// Catches http requests from client-side mysimbdp-daas API calls and is part of mysimbdp-Agreementingest
require('axios');
const agreementRouter = require('express').Router()
require('dotenv').config()

const Agreement = require('./agreementModel.js');

agreementRouter.get('/', async (request, response) => {
  const agreement = await Agreement.find({})
  response.json(agreement)
});


// Changed so it gets the document property tenantId, instead of datatbase document _id
agreementRouter.get('/:tenantId', async (request, response) => {
  const agreement = await Agreement.findOne({
    tenantId: request.params.tenantId,
    'freeform_data.id': request.params.id 
  });
  if (agreement) {
    response.json(agreement.toJSON())
  } else {
    response.status(404).end
  }
});


agreementRouter.post('/', async (request, response) => {
  const body = request.body

  const agreement = new Agreement({
    tenantId: body.tenantId,
    data_file_constraints: body.data_file_constraints,
    service_agreement_constraints: body.service_agreement_constraints
  });

  const savedAgreement = await agreement.save()
  response.status(201).json(savedAgreement)
});


module.exports = agreementRouter
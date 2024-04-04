// Catches http requests from client-side mysimbdp-daas API calls and is part of mysimbdp-dataingest
require('axios');
const dataRouter = require('express').Router()
require('dotenv').config()

const Data = require('./dataModel.js');

dataRouter.get('/', async (request, response) => {
  const data = await Data.find({})
  response.json(data)
});


// Changed so it gets the document property id, instead of database document _id
dataRouter.get('/:id', async (request, response) => {
  // const data = await Data.findById(request.params.id)
  const data = await Data.findOne({ id: request.params.id });
  if (data) {
    response.json(data.toJSON())
  } else {
    response.status(404).end
  }
});


dataRouter.post('/', async (request, response) => {
  const body = request.body

  const data = new Data({
    id: body.id,
    sampling_rate: body.sampling_rate,
    timestamp: body.timestamp,
    location: body.location,
    sensor: body.sensor,
    sensordatavalues: body.sensordatavalues
  });

  const savedData = await data.save()
  response.status(201).json(savedData)
});


// Changed so it gets the document property id, instead of database document _id
dataRouter.delete('/:id', async (request, response) => {
  // await Data.findByIdAndRemove(request.params.id)
  await Data.findOneAndRemove({ id: request.params.id })
  response.status(204).end()
});

module.exports = dataRouter
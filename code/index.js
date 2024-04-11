require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http')
const dataRouter = require('./assignment_1_code_used/dataRouter.js');
const agreementRouter = require('./database_api/agreementRouter.js');
const tenantRouter = require('./database_api/tenantRouter.js');
const logRouter = require('./database_api/logRouter.js');
const { createAgreement } = require('./database_api/agreementService.js');
require('express-async-errors');
require('dotenv').config();
const serviceAgreements = require('./service_contracts.json');
const IngestManager = require('./ingest-manager.js');
const StreamInput = require('./stream-input.js');

// Checks if main initialization instance for the application so duplicates aren't created when running tests
// Avoids errors of port being in use
if (require.main === module) {
  const PORT = 3000;
  const mysimbdp = express();

  // middleware declaration
  mysimbdp.use(bodyParser.json());
  mysimbdp.use(bodyParser.urlencoded({ extended: true }));
  mysimbdp.use(cors());
  mysimbdp.use(express.json());

  console.log('connecting to mysimbdp-coredms (MongoDB)');

  //mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017/`)
  mongoose.connect(`mongodb://root:password@mongo:27017/`)
    .then(() => {
      console.log('connected to mysimbdp-coredms (MongoDB)')
    })
    .catch((error) => {
      console.log('error connection to mysimbdp-coredms (MongoDB):', error.message)
    });

  // Route
  mysimbdp.use('/data', dataRouter);
  mysimbdp.use('/agreement', agreementRouter);
  mysimbdp.use('/tenant', tenantRouter);
  mysimbdp.use('/log', logRouter);

  const server = http.createServer(mysimbdp)

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

  serviceAgreements.forEach((agreement) => createAgreement(agreement));
}

const manager = new IngestManager();
const streamInput = new StreamInput(manager);
manager.streamInput = streamInput;

module.exports = { streamInput };
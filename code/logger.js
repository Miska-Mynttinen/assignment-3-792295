const { create } = require('./database_api/logService.js');

const createLog = async (tenantId, metrics) => {
    // id is only for testing for now
    const dataToStore = {
        id: generateRandomStringId(),
        tenantId: tenantId,
        metrics: metrics
    }
    await create(dataToStore);
}

const generateRandomStringId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = { createLog }

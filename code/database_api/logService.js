// mysimbdp-daas API for client use
const axios = require('axios');

const baseUrl = 'http://localhost:3000/log';

const create = async newObject => {
    const response = await axios.post(`${baseUrl}/${newObject.tenantId}`, newObject)
    return response.data
}
  
module.exports = { create }
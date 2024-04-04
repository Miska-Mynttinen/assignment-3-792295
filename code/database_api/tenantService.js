// mysimbdp-daas API for client use
const axios = require('axios');

const baseUrl = 'http://localhost:3000/tenant';

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getOne = async fileData => {
    const request = axios.get(`${baseUrl}/${fileData.tenantId}/${fileData.id}`)
    return request.then(response => response.data)
}

const create = async newObject => {
    const response = await axios.post(`${baseUrl}/${newObject.tenantId}`, newObject)
    return response.data
}
  
const update = (id, newObject) => {
const request = axios.put(`${baseUrl}/${newObject.tenantId}/${id}`, newObject)
return request.then(response => response.data)
}

const remove = id => {
    const request = axios.delete(`${baseUrl}/${newObject.tenantId}/${id}`)
    return request.then(response => response.data)
}

const getTestSourceData = () => {
    const request = axios.get('https://data.sensor.community/static/v1/data.json');
    return request.then(response => response.data)
}

module.exports = { getAll, getOne, create, update, remove, getTestSourceData }
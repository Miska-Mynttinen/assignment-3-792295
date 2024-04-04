// mysimbdp-daas API for client use
const axios = require('axios');

const baseUrl = 'http://localhost:3000/data';

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getOne = async id => {
    const request = axios.get(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const create = async newObject => {
    const response = await axios.post(baseUrl, newObject)
    return response.data
}
  
const update = (id, newObject) => {
const request = axios.put(`${baseUrl}/${id}`, newObject)
return request.then(response => response.data)
}

const remove = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const getTestSourceData = () => {
    const request = axios.get('https://data.sensor.community/static/v1/data.json');
    return request.then(response => response.data)
}

module.exports = { getAll, getOne, create, update, remove, getTestSourceData }
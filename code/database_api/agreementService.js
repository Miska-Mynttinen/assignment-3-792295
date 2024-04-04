// mysimbdp-daas API for client use
const axios = require('axios');

const baseUrl = 'http://localhost:3000/agreement';

const getAgreements = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getAgreement = async id => {
    const request = axios.get(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const createAgreement = async newObject => {
    const response = await axios.post(`${baseUrl}`, newObject)
    return response.data
}
 
const updateAgreement = (id, newObject) => {
const request = axios.put(`${baseUrl}/${id}`, newObject)
return request.then(response => response.data)
}

const removeAgreement = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}


module.exports = { getAgreements, getAgreement, createAgreement, updateAgreement, removeAgreement }
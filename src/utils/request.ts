import axios from 'axios'

const request = axios.create({
    baseURL: '',
    timeout: 10000
})

export default request

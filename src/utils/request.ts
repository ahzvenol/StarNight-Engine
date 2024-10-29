import axios from 'axios'

const request = axios.create({
    baseURL: '',
    timeout: 10000
})

// request.interceptors.request.use((config) => config)

request.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(new Error(error.message))
)

export default request

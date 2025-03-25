import axios from 'axios'

const resource = axios.create({
    baseURL: import.meta.env.BASE_URL
})

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
})

export { resource, api }

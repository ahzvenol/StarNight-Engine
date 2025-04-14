import axios from 'axios'

const resource = axios.create({
    baseURL: import.meta.env.BASE_URL
})

export { resource }

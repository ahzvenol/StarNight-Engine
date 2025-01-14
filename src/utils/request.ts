import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.BASE_URL
})

export default request

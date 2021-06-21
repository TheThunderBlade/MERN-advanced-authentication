import axios from 'axios'
import {AuthResponse} from "../models/response/AuthResponse";

export const API_URL = `http://localhost:5000/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use(config => config, async error => {
    const originalReq = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry ) {
        originalReq._isRetry = true
        try {
            const res = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', res.data.accessToken)
            return $api.request(originalReq)
        } catch (e) {
            console.log('Не авторизован')
        }
    }
    throw error
})

export default $api
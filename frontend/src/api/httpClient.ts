import axios from 'axios';
import { storage } from '../utils/storage';

const httpClient = axios.create({
    baseURL: 'http://localhost:3002/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

httpClient.interceptors.request.use(
    (config) => {
        const token = storage.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isExpiredToken = error.response?.status === 400 && error.response?.data?.message === 'Invalid token.';
        const isUnauthorized = error.response?.status === 401;

        if (isUnauthorized || isExpiredToken) {
            storage.removeToken();
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(error);
    }
);

export default httpClient;
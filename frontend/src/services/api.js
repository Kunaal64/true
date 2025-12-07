import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/sales',
});

export const getSales = (params) => api.get('/', { params });
export const getUniqueValues = (field) => api.get(`/filters/${field}`);

export default api;

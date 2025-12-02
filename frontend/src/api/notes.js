import axios from 'axios';

const api = axios.create({
    baseURL: '/api/notes',
});

export const getNotes = (params) => api.get('/', { params });
export const getNote = (id) => api.get(`/${id}`);
export const createNote = (data) => api.post('/', data);
export const updateNote = (id, data) => api.put(`/${id}`, data);
export const deleteNote = (id) => api.delete(`/${id}`);
export const getFolders = () => api.get('/folders/list'); // Corrected endpoint path

export default api;

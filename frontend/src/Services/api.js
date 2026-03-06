import axios from 'axios';

const API = axios.create({
    baseURL: 'https://parking-backend-rcqf.onrender.com'
,
});

export const getSlots = () => API.get('/');
export const addVehicle = (formData) => API.post('/', formData);
export const checkOutVehicle = (id, exitData) => API.put(`/${id}/checkout`, exitData);
export const updateVehicle = (id, updateData) => API.put(`/${id}`, updateData);
export const deleteVehicle = (id) => API.delete(`/${id}`);

export default API;
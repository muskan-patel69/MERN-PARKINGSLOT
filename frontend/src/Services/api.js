import axios from 'axios';

const API = axios.create({
<<<<<<< HEAD
    baseURL: 'https://backend-parking-smat.onrender.com/api/slots'
=======
    baseURL: 'http://localhost:3000/api/slots'
>>>>>>> dd28d0f (added live duration and occupancy analytics)
,
});

export const getSlots = () => API.get('/');
export const addVehicle = (formData) => API.post('/', formData);
export const checkOutVehicle = (id, exitData) => API.put(`/${id}/checkout`, exitData);
export const updateVehicle = (id, updateData) => API.put(`/${id}`, updateData);
export const deleteVehicle = (id) => API.delete(`/${id}`);

export default API;

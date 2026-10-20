import axios from "axios";

const api = axios.create({
  baseURL: "https://parking-backend-rcqf.onrender.com"
});

export default api;
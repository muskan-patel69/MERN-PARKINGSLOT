import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-parking-smat.onrender.com/api"
  
});

export default api;

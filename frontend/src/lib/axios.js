import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "https://backend-parking-smat.onrender.com/api"
=======
  baseURL:  "http://localhost:3000/api"
>>>>>>> dd28d0f (added live duration and occupancy analytics)
  
});

export default api;

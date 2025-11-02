import axios from 'axios';
import Cookies from "js-cookie";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, 
//   withCredentials: true, // optional for JWT/cookies
// });

// export default api;



// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// // Automatically attach token if exists
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });



const api = axios.create({
baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});


 export default api;




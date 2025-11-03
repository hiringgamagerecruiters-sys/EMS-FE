import axios from 'axios';
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});

export default api;

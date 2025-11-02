import axios from "axios";

const API_URL = "http://localhost:8088/api/auth";

const authApi = {
  login: (data) => axios.post(`${API_URL}/login`, data),
  register: (data) => axios.post(`${API_URL}/register`, data),
  
};



export default authApi;

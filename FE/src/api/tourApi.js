import axios from "axios";

const API_URL = "http://localhost:8088/api/tours"; // ✅ backend port của bạn

const tourApi = {
  getAll: (params = {}) => axios.get(API_URL, { params }),

  getById: (id) => axios.get(`${API_URL}/${id}`),

  // Tìm kiếm tour (nếu backend hỗ trợ)
  search: (keyword) => axios.get(API_URL, { params: { q: keyword } }),
};

export default tourApi;

import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8088/") + "api";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Tự động gắn token (nếu có)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const userApi = {
  // 🧍‍♂️ 1. Lấy thông tin người dùng hiện tại
  getProfile: () => axiosClient.get("/users/me"),

  // 🧾 2. Cập nhật thông tin người dùng (tên, sdt, địa chỉ,...)
  updateProfile: (data) => axiosClient.put("/users/me", data),

  // 🔒 3. Đổi mật khẩu
  changePassword: (data) => axiosClient.put("/users/change-password", data),

  // 📦 4. Lấy danh sách tour đã đặt
  getMyBookings: () => axiosClient.get("/auth/my-bookings"),

  // 🗑️ 5. Hủy tour
  cancelBooking: (id) => axiosClient.put(`/users/cancel-booking/${id}`),

  // 📅 6. Đặt tour mới
  createBooking: (data) => axiosClient.post("/bookings", data),

  // 🌍 7. Lấy chi tiết 1 tour
  getTourDetail: (id) => axiosClient.get(`/tours/${id}`),

  // 💬 8. Gửi liên hệ hoặc phản hồi
  sendContact: (data) => axiosClient.post("/contacts", data),
};

export default userApi;

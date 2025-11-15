import axios from "axios";

const BASE_URL = "http://localhost:8088/api/admin";

const adminApi = {
  // Location
  addLocation: (data) => axios.post(`${BASE_URL}/locations/add-location`, data),
  getLocations: () => axios.get(`${BASE_URL}/locations`),  
  updateLocation: (id, data) => axios.put(`${BASE_URL}/locations/${id}`, data),
  deleteLocation: (id) => axios.delete(`${BASE_URL}/locations/${id}`),

  // Service
  addService: (data) => axios.post(`${BASE_URL}/services/add-service`, data),
  getServices: () => axios.get(`${BASE_URL}/services`),
  updateService: (id, data) => axios.put(`${BASE_URL}/services/${id}`, data),
  deleteService: (id) => axios.delete(`${BASE_URL}/services/${id}`),

  // Tour
  addTour: (data) => axios.post(`${BASE_URL}/tours/add-tour`, data),
  getTours: () => axios.get(`${BASE_URL}/tours`),
  updateTour: (id, data) => axios.put(`${BASE_URL}/tours/${id}`, data),
  deleteTour: (id) => axios.delete(`${BASE_URL}/tours/${id}`),
  
  // User
  addUser: (data) => axios.post(`${BASE_URL}/users/add-user`, data),
  getUsers: () => axios.get(`${BASE_URL}/users`),
  updateUser: (id, data) => axios.put(`${BASE_URL}/users/${id}`, data),
  deleteUser: (id) => axios.delete(`${BASE_URL}/users/${id}`),

  // Customer
  addCustomer: (data) => axios.post(`${BASE_URL}/customers/add-customer`, data),
  getCustomers: () => axios.get(`${BASE_URL}/customers`),
  updateCustomer: (id, data) => axios.put(`${BASE_URL}/customers/${id}`, data),
  deleteCustomer: (id) => axios.delete(`${BASE_URL}/customers/${id}`),

  // Employee
  addEmployee: (data) => axios.post(`${BASE_URL}/employees/add-employee`, data),
  getEmployees: () => axios.get(`${BASE_URL}/employees`),
  updateEmployee: (id, data) => axios.put(`${BASE_URL}/employees/${id}`, data),
  deleteEmployee: (id) => axios.delete(`${BASE_URL}/employees/${id}`),
  getRoles: () => axios.get("/employees/roles"),
  
  // Booking
  addBooking: (data) => axios.post(`${BASE_URL}/bookings/add-booking`, data),
  getBookings: () => axios.get(`${BASE_URL}/bookings`),
  updateBooking: (id, data) => axios.put(`${BASE_URL}/bookings/${id}`, data),
  deleteBooking: (id) => axios.delete(`${BASE_URL}/bookings/${id}`),
  
  // Role & Permission management
  getRoles: () => axios.get(`${BASE_URL}/role-permissions/roles`),
  addRole: (data) => axios.post(`${BASE_URL}/role-permissions/roles`, data),
  deleteRole: (id) => axios.delete(`${BASE_URL}/role-permissions/roles/${id}`),

  getPermissions: () => axios.get(`${BASE_URL}/role-permissions/permissions`),
  addPermission: (data) => axios.post(`${BASE_URL}/role-permissions/permissions`, data),
  deletePermission: (id) => axios.delete(`${BASE_URL}/role-permissions/permissions/${id}`),

  getPermissionsByRole: (roleId) => axios.get(`${BASE_URL}/role-permissions/roles/${roleId}/permissions`),
  updateRolePermissions: (roleId, permission_ids) =>
    axios.post(`${BASE_URL}/roles/${roleId}/role-permissions/permissions`, { permission_ids }),
  
  // 📸 Quản lý ảnh tour
  uploadTourImage: (tourId, data) =>
    axios.post(`${BASE_URL}/tours/${tourId}/upload-image`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getTourImages: (tourId) => axios.get(`${BASE_URL}/tours/${tourId}/images`),
  deleteTourImage: (imageId) => axios.delete(`${BASE_URL}/tours/image/${imageId}`),

  // 🧩 Service
  uploadServiceImage: (id, formData) =>
    axios.post(`${BASE_URL}/services/${id}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getServiceImages: (id) => axios.get(`${BASE_URL}/services/${id}/images`),
  deleteServiceImage: (imgId) => axios.delete(`${BASE_URL}/services/image/${imgId}`),

  // Payment
  getPayments: () => axios.get(`${BASE_URL}/payments`),
  getPaymentsByBooking: (bookingId) => axios.get(`${BASE_URL}/payments/booking/${bookingId}`),
  addPayment: (data) => axios.post(`${BASE_URL}/payments/add-payment`, data),
  updatePayment: (id, data) => axios.put(`${BASE_URL}/payments/${id}`, data),
  deletePayment: (id) => axios.delete(`${BASE_URL}/payments/${id}`),

  // ===== Review =====
  getReviews: () => axios.get(`${BASE_URL}/reviews`),
  getReviewsByTour: (tourId) => axios.get(`${BASE_URL}/reviews/tour/${tourId}`),
  getReviewsByGuide: (guideId) => axios.get(`${BASE_URL}/reviews/guide/${guideId}`),
  addReview: (data) => axios.post(`${BASE_URL}/reviews/add-review`, data),
  updateReview: (id, data) => axios.put(`${BASE_URL}/reviews/${id}`, data),
  deleteReview: (id) => axios.delete(`${BASE_URL}/reviews/${id}`),
  };
  

export default adminApi;

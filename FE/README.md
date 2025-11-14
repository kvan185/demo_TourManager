Dưới đây mình **tổng hợp đầy đủ tất cả API endpoint cho Backend + các URL cần gọi từ Frontend** theo từng module.
Format rõ ràng, dễ copy vào file api.js hoặc Postman.

---

# ✅ **A. Danh sách ROUTER Backend (BE)**

(Đã rút gọn đúng theo yêu cầu: `/add-xxx`, `/:id`…)

---

## **1. AUTH**

```
POST /auth/login
POST /auth/register
GET  /auth/me
```

---

## **2. USERS**

```
GET  /users
POST /users/add
GET  /users/:id
PUT  /users/:id
DELETE /users/:id
```

---

## **3. ROLES**

```
GET  /roles
POST /roles/add
GET  /roles/:id
PUT  /roles/:id
DELETE /roles/:id
```

---

## **4. PERMISSIONS**

```
GET  /permissions
POST /permissions/add
GET  /permissions/:id
PUT  /permissions/:id
DELETE /permissions/:id
```

---

## **5. ROLE – PERMISSION**

```
GET    /roles/:roleId/permissions
POST   /roles/:roleId/permissions/add
DELETE /roles/:roleId/permissions/:permissionId
```

---

## **6. CUSTOMERS**

```
GET  /customers
POST /customers/add
GET  /customers/:id
PUT  /customers/:id
DELETE /customers/:id
```

---

## **7. EMPLOYEES**

```
GET  /employees
POST /employees/add
GET  /employees/:id
PUT  /employees/:id
DELETE /employees/:id
```

---

## **8. LOCATIONS**

```
GET  /locations
POST /locations/add
GET  /locations/:id
PUT  /locations/:id
DELETE /locations/:id
```

---

## **9. TOURS**

```
GET  /tours
POST /tours/add
GET  /tours/:id
PUT  /tours/:id
DELETE /tours/:id
```

### Tour images

```
GET    /tours/:id/images
POST   /tours/:id/images/add
DELETE /tours/images/:imageId
```

---

## **10. TOUR SCHEDULES**

```
GET  /tour-schedules
POST /tour-schedules/add
GET  /tour-schedules/:id
PUT  /tour-schedules/:id
DELETE /tour-schedules/:id
```

---

## **11. TOUR ITINERARIES**

```
GET  /tours/:id/itineraries
POST /tours/:id/itineraries/add
GET  /itineraries/:id
PUT  /itineraries/:id
DELETE /itineraries/:id
```

---

## **12. SERVICES**

```
GET  /services
POST /services/add
GET  /services/:id
PUT  /services/:id
DELETE /services/:id
```

### Service images

```
GET    /services/:id/images
POST   /services/:id/images/add
DELETE /services/images/:imageId
```

---

## **13. TOUR – SERVICE mapping**

```
GET  /tours/:id/services
POST /tours/:id/services/add
PUT  /tours/:id/services/:serviceId
DELETE /tours/:id/services/:serviceId
```

---

## **14. TOUR GUIDES**

```
GET  /tour-guides
POST /tour-guides/add
GET  /tour-guides/:id
PUT  /tour-guides/:id
DELETE /tour-guides/:id

GET    /tour-schedules/:scheduleId/guides
POST   /tour-schedules/:scheduleId/guides/add
DELETE /tour-schedules/:scheduleId/guides/:employeeId
```

---

## **15. CUSTOM TOURS**

```
GET  /custom-tours
POST /custom-tours/add
GET  /custom-tours/:id
PUT  /custom-tours/:id
DELETE /custom-tours/:id
```

### Destinations

```
GET  /custom-tours/:id/destinations
POST /custom-tours/:id/destinations/add
PUT  /custom-tours/destinations/:destId
DELETE /custom-tours/destinations/:destId
```

### Services

```
GET  /custom-tours/:id/services
POST /custom-tours/:id/services/add
PUT  /custom-tours/services/:serviceId
DELETE /custom-tours/services/:serviceId
```

### Guides

```
GET    /custom-tours/:id/guides
POST   /custom-tours/:id/guides/add
DELETE /custom-tours/:id/guides/:employeeId
```

---

## **16. EMPLOYEE SCHEDULES**

```
GET  /employee-schedules
POST /employee-schedules/add
GET  /employee-schedules/:id
PUT  /employee-schedules/:id
DELETE /employee-schedules/:id
```

---

## **17. BOOKINGS**

```
GET  /bookings
POST /bookings/add
GET  /bookings/:id
PUT  /bookings/:id
DELETE /bookings/:id
```

### Booking passengers

```
GET  /bookings/:id/passengers
POST /bookings/:id/passengers/add
PUT  /passengers/:id
DELETE /passengers/:id
```

---

## **18. PAYMENTS**

```
GET  /payments
POST /payments/add
GET  /payments/:id
PUT  /payments/:id
DELETE /payments/:id
```

---

## **19. INVOICES**

```
GET  /invoices
POST /invoices/add
GET  /invoices/:id
PUT  /invoices/:id
DELETE /invoices/:id
```

---

## **20. REVIEWS**

```
GET  /reviews
POST /reviews/add
GET  /reviews/:id
PUT  /reviews/:id
DELETE /reviews/:id
```

---

# 🎯 **B. Các LINK FE (Frontend) cần gọi**

Đây là chuyển đổi từ BE → FE, theo cấu trúc API frontend thường dùng.

---

## 🔹 **authApi**

```
POST /auth/login
GET  /auth/me
```

---

## 🔹 **userApi**

```
GET  /users
POST /users/add
GET  /users/:id
PUT  /users/:id
DELETE /users/:id
```

---

## 🔹 **roleApi**

```
GET  /roles
POST /roles/add
PUT  /roles/:id
DELETE /roles/:id

GET  /roles/:id/permissions
POST /roles/:id/permissions/add
DELETE /roles/:id/permissions/:permissionId
```

---

## 🔹 **permissionApi**

```
GET  /permissions
POST /permissions/add
PUT  /permissions/:id
DELETE /permissions/:id
```

---

## 🔹 **customerApi**

```
GET  /customers
POST /customers/add
GET  /customers/:id
PUT  /customers/:id
DELETE /customers/:id
```

---

## 🔹 **employeeApi**

(Frontend quản lý nhân viên + phân quyền)

```
GET  /employees
POST /employees/add
GET  /employees/:id
PUT  /employees/:id
DELETE /employees/:id
```

---

## 🔹 **locationApi**

```
GET  /locations
POST /locations/add
GET  /locations/:id
PUT  /locations/:id
DELETE /locations/:id
```

---

## 🔹 **tourApi**

```
GET  /tours
POST /tours/add
GET  /tours/:id
PUT  /tours/:id
DELETE /tours/:id

GET    /tours/:id/images
POST   /tours/:id/images/add
DELETE /tours/images/:imageId
```

---

## 🔹 **scheduleApi**

```
GET  /tour-schedules
POST /tour-schedules/add
GET  /tour-schedules/:id
PUT  /tour-schedules/:id
DELETE /tour-schedules/:id
```

---

## 🔹 **itineraryApi**

```
GET  /tours/:id/itineraries
POST /tours/:id/itineraries/add
PUT  /itineraries/:id
DELETE /itineraries/:id
```

---

## 🔹 **serviceApi**

```
GET  /services
POST /services/add
GET  /services/:id
PUT  /services/:id
DELETE /services/:id
```

---

## 🔹 **bookingApi**

```
GET  /bookings
POST /bookings/add
GET  /bookings/:id
PUT  /bookings/:id
DELETE /bookings/:id

GET  /bookings/:id/passengers
POST /bookings/:id/passengers/add
PUT  /passengers/:id
DELETE /passengers/:id
```

---

## 🔹 **paymentApi**

```
POST /payments/add
GET  /payments/:id
```

---

## 🔹 **invoiceApi**

```
GET  /invoices
POST /invoices/add
GET  /invoices/:id
```

---

## 🔹 **reviewApi**

```
GET  /reviews
POST /reviews/add
GET  /reviews/:id
PUT  /reviews/:id
DELETE /reviews/:id
```

---

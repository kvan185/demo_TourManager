Dưới đây là **danh sách đầy đủ tất cả các router REST API** cần cho dự án *dựa trên toàn bộ các bảng trong database*.
Được liệt kê gọn theo dạng:

```
GET /tours
POST /tours/add
GET /tours/:id
PUT /tours/:id
DELETE /tours/:id
```

---

# ✅ **1. AUTH + USER**

```
POST /auth/login
POST /auth/register
GET  /auth/me

GET  /users
POST /users/add
GET  /users/:id
PUT  /users/:id
DELETE /users/:id
```

---

# ✅ **2. ROLES – PERMISSIONS**

```
GET  /roles
POST /roles/add
GET  /roles/:id
PUT  /roles/:id
DELETE /roles/:id

GET  /permissions
POST /permissions/add
GET  /permissions/:id
PUT  /permissions/:id
DELETE /permissions/:id

GET  /roles/:id/permissions
POST /roles/:id/permissions/add
DELETE /roles/:id/permissions/:permissionId
```

---

# ✅ **3. CUSTOMERS (Khách hàng)**

```
GET  /customers
POST /customers/add
GET  /customers/:id
PUT  /customers/:id
DELETE /customers/:id
```

---

# ✅ **4. EMPLOYEES (Nhân viên – hướng dẫn viên)**

```
GET  /employees
POST /employees/add
GET  /employees/:id
PUT  /employees/:id
DELETE /employees/:id
```

---

# ✅ **5. LOCATIONS**

```
GET  /locations
POST /locations/add
GET  /locations/:id
PUT  /locations/:id
DELETE /locations/:id
```

---

# ✅ **6. TOURS**

```
GET  /tours
POST /tours/add
GET  /tours/:id
PUT  /tours/:id
DELETE /tours/:id
```

### **Tour Images**

```
GET    /tours/:id/images
POST   /tours/:id/images/add
DELETE /tours/images/:imageId
```

---

# ✅ **7. TOUR SCHEDULES (Lịch chạy tour)**

```
GET  /tour-schedules
POST /tour-schedules/add
GET  /tour-schedules/:id
PUT  /tour-schedules/:id
DELETE /tour-schedules/:id
```

---

# ✅ **8. TOUR ITINERARIES (Lịch trình tour)**

```
GET  /tours/:id/itineraries
POST /tours/:id/itineraries/add
GET  /itineraries/:id
PUT  /itineraries/:id
DELETE /itineraries/:id
```

---

# ✅ **9. SERVICES (Dịch vụ)**

```
GET  /services
POST /services/add
GET  /services/:id
PUT  /services/:id
DELETE /services/:id
```

### Service Images

```
GET    /services/:id/images
POST   /services/:id/images/add
DELETE /services/images/:imageId
```

---

# ✅ **10. TOUR – SERVICES mapping**

```
GET  /tours/:id/services
POST /tours/:id/services/add
PUT  /tours/:id/services/:serviceId
DELETE /tours/:id/services/:serviceId
```

---

# ✅ **11. TOUR GUIDES**

```
GET  /tour-guides
POST /tour-guides/add
GET  /tour-guides/:id
PUT  /tour-guides/:id
DELETE /tour-guides/:id

GET  /tour-schedules/:scheduleId/guides
POST /tour-schedules/:scheduleId/guides/add
DELETE /tour-schedules/:scheduleId/guides/:employeeId
```

---

# ✅ **12. CUSTOM TOUR (Tour theo yêu cầu)**

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
GET  /custom-tours/:id/guides
POST /custom-tours/:id/guides/add
DELETE /custom-tours/:id/guides/:employeeId
```

---

# ✅ **13. EMPLOYEE SCHEDULES**

```
GET  /employee-schedules
POST /employee-schedules/add
GET  /employee-schedules/:id
PUT  /employee-schedules/:id
DELETE /employee-schedules/:id
```

---

# ✅ **14. BOOKINGS**

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

# ✅ **15. PAYMENTS**

```
GET  /payments
POST /payments/add
GET  /payments/:id
PUT  /payments/:id
DELETE /payments/:id
```

---

# ✅ **16. INVOICES**

```
GET  /invoices
POST /invoices/add
GET  /invoices/:id
PUT  /invoices/:id
DELETE /invoices/:id
```

---

# ✅ **17. REVIEWS**

```
GET  /reviews
POST /reviews/add
GET  /reviews/:id
PUT  /reviews/:id
DELETE /reviews/:id
```

---

# 🎉 **Bạn muốn mình xuất ra dạng file README.md?**

* ✔ Dễ copy
* ✔ Dễ đưa vào API docs
* ✔ Dễ chia task cho backend

Chỉ cần bảo mình “xuất ra file”!

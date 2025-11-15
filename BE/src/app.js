import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

// Middlewares
// import { requestLogger } from './middlewares/logger.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import { authenticate, roleRedirect, requirePermission } from "./middlewares/auth.js";

// Public routes
import authRoutes from './routes/auth.js';
import toursRoutes from './routes/tours.js';
import customerRouter from './routes/customerActions.js';

// Admin routes
import locationRouter from "./routes/admin/locations.js";
import serviceRouter from "./routes/admin/services.js";
import tourRouter from "./routes/admin/tours.js";
// import userRouter from "./routes/admin/users.js";
import customersAdminRouter from "./routes/admin/customers.js";
import employeeRouter from "./routes/admin/employees.js";
import tourServiceRouter from "./routes/admin/tour_services.js";
import bookingAdminRouter from "./routes/admin/bookings.js";
import passengerRouter from "./routes/admin/booking_passengers.js";
import paymentAdminRouter from "./routes/admin/payments.js";
import invoiceRouter from "./routes/admin/invoices.js";
import reviewRouter from "./routes/admin/reviews.js";
import employeeScheduleRouter from "./routes/admin/employeeSchedules.js";
import customTourRouter from "./routes/admin/customTours.js";
import rolePermissionRouter from "./routes/admin/rolePermission.js";

dotenv.config();
const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cors());
// app.use(requestLogger);

// ===== Static Uploads =====
app.use("/uploads", express.static("uploads"));

// ===== Public Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/customer', customerRouter);

// ===== Admin Routes (Require Login) =====
const adminBase = "/api/admin";
// app.use(adminBase, authenticate);

app.use(`${adminBase}/role-permissions`, rolePermissionRouter);
app.use(`${adminBase}/locations`, locationRouter);
app.use(`${adminBase}/services`, serviceRouter);
app.use(`${adminBase}/tours`, tourRouter);
// app.use(`${adminBase}/users`, userRouter);
app.use(`${adminBase}/customers`, customersAdminRouter);
app.use(`${adminBase}/employees`, employeeRouter);
app.use(`${adminBase}/tour-services`, tourServiceRouter);
app.use(`${adminBase}/bookings`, bookingAdminRouter);
app.use(`${adminBase}/booking-passengers`, passengerRouter);
app.use(`${adminBase}/payments`, paymentAdminRouter);
app.use(`${adminBase}/invoices`, invoiceRouter);
app.use(`${adminBase}/reviews`, reviewRouter);
app.use(`${adminBase}/employee-schedules`, employeeScheduleRouter);
app.use(`${adminBase}/custom-tours`, customTourRouter);

// ===== Health Check =====
app.get('/api/health', (_, res) => res.json({ ok: true }));

// ===== Error Handler =====
// app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

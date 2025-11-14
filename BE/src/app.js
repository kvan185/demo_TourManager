import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import toursRoutes from './routes/tours.js';
import bookingRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payments.js';
import reviewRoutes from './routes/reviews.js';
import locationRouter from "./routes/admin/locations.js";
import serviceRouter from "./routes/admin/services.js";
import tourRouter from "./routes/admin/tours.js";
import userRouter from "./routes/admin/users.js";
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import customerRouter from "./routes/admin/customers.js";
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
import { authenticate } from './middlewares/auth.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(errorHandler);

// 🔓 Các route public (không cần token)
app.use('/api/tours', toursRoutes);
app.use('/api/auth', authRoutes);

app.use("/uploads", express.static("uploads"));

app.use('/api/bookings', authenticate, bookingRoutes);
app.use('/api/payments', authenticate, paymentRoutes);
app.use('/api/reviews', authenticate, reviewRoutes);
app.use('/api/users', userRoutes);


// 🔒 Các route admin (yêu cầu token và quyền admin)
app.use("/api/admin", rolePermissionRouter);
app.use("/api/admin/locations", locationRouter);
app.use("/api/admin/services", serviceRouter);
app.use("/api/admin/tours", tourRouter);
app.use("/api/admin/users", userRouter);
app.use("/api/admin/customers", customerRouter);
app.use("/api/admin/employees", employeeRouter);
app.use("/api/admin/tour-services", tourServiceRouter);
app.use("/api/admin/bookings", bookingAdminRouter);
app.use("/api/admin/booking-passengers", passengerRouter);
app.use("/api/admin/payments", paymentAdminRouter);
app.use("/api/admin/invoices", invoiceRouter);
app.use("/api/admin/reviews", reviewRouter);
app.use("/api/admin/employee-schedules", employeeScheduleRouter);
app.use("/api/admin/custom-tours", customTourRouter);


app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 8088;
app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));

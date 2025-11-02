import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ===== ADMIN PAGES =====
import LocationManager from "./pages/admin/LocationManager";
import ServiceManager from "./pages/admin/ServiceManager";
import UserManager from "./pages/admin/UserManager";
import TourManager from "./pages/admin/TourManager";
import CustomerManager from "./pages/admin/CustomerManager";
import EmployeeManager from "./pages/admin/EmployeeManager";
import BookingManager from "./pages/admin/BookingManager";
import RolePermissionList from "./pages/admin/RolePermissionList";
import HomePageAdmin from "./pages/admin/HomePageAdmin";
import PaymentManager from "./pages/admin/PaymentManager";
import ReportManager from "./pages/admin/ReportManager";
import ReviewManager from "./pages/admin/ReviewManager";

// ===== USER PAGES =====
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import HomePage from "./pages/user/HomePage";
import TourList from "./pages/user/TourList";
import TourDetail from "./pages/user/TourDetail";
import MyBookings from "./pages/user/MyBookings";
import Contact from "./pages/user/Contact";
import About from "./pages/user/About";
import Profile from "./pages/user/Profile";

// ===== LAYOUTS =====
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* === AUTH ROUTES === */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === ADMIN ROUTES === */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<HomePageAdmin />} />
            <Route path="/admin/tours" element={<TourManager />} />
            <Route path="/admin/employees" element={<EmployeeManager />} />
            <Route path="/admin/bookings" element={<BookingManager />} />
            <Route path="/admin/services" element={<ServiceManager />} />
            <Route path="/admin/users" element={<UserManager />} />
            <Route path="/admin/locations" element={<LocationManager />} />
            <Route path="/admin/customers" element={<CustomerManager />} />
            <Route path="/admin/role-permissions" element={<RolePermissionList />} />
            <Route path="/admin/payments" element={<PaymentManager />} />
            <Route path="/admin/reports" element={<ReportManager />} />
            <Route path="/admin/reviews" element={<ReviewManager />} />
          </Route>

          {/* === USER ROUTES === */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/tour/:id" element={<TourDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

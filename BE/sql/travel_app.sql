-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2025 at 07:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `travel_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `booking_code` varchar(50) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `schedule_id` bigint(20) DEFAULT NULL,
  `custom_tour_id` bigint(20) DEFAULT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `qty_adults` int(11) NOT NULL DEFAULT 1,
  `qty_children` int(11) NOT NULL DEFAULT 0,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `payment_status` enum('unpaid','partial','paid','refunded') DEFAULT 'unpaid',
  `refund_note` varchar(255) DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL,
  `note` text DEFAULT NULL
) ;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_code`, `customer_id`, `schedule_id`, `custom_tour_id`, `booking_date`, `qty_adults`, `qty_children`, `total_amount`, `status`, `payment_status`, `refund_note`, `refunded_at`, `note`) VALUES
(1, 'BK001', 1, 1, NULL, '2025-10-31 06:38:09', 2, 1, 10800000.00, 'confirmed', 'paid', NULL, NULL, 'Gia đình có trẻ nhỏ'),
(2, 'BK002', 1, 2, NULL, '2025-10-31 06:38:09', 1, 0, 4600000.00, 'pending', 'unpaid', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_passengers`
--

CREATE TABLE `booking_passengers` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `gender` enum('male','female','other') DEFAULT 'other',
  `birth_date` date DEFAULT NULL,
  `passport_number` varchar(100) DEFAULT NULL,
  `seat_type` varchar(50) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `booking_passengers`
--

INSERT INTO `booking_passengers` (`id`, `booking_id`, `full_name`, `gender`, `birth_date`, `passport_number`, `seat_type`, `price`) VALUES
(1, 1, 'Nguyễn Văn A', 'male', '1995-04-12', 'C1234567', 'Người lớn', 3600000.00),
(2, 1, 'Trần Thị E', 'female', '1997-09-21', 'D7654321', 'Người lớn', 3600000.00),
(3, 1, 'Nguyễn Văn F', 'male', '2015-01-15', NULL, 'Trẻ em', 1800000.00);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `full_name` varchar(200) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT 'other',
  `address` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `full_name`, `phone`, `birthday`, `gender`, `address`, `note`, `created_at`, `updated_at`) VALUES
(1, 5, 'Nguyễn Văn A', '0905123456', '1995-04-12', 'male', 'Hà Nội', 'Khách VIP', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(2, 6, 'Nguyễn Văn An', '0905123456', NULL, 'other', 'Hà Nội', 'Hà Nội', '2025-10-31 06:44:12', '2025-10-31 06:44:12');

-- --------------------------------------------------------

--
-- Table structure for table `custom_tours`
--

CREATE TABLE `custom_tours` (
  `id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `preferred_start_date` date DEFAULT NULL,
  `preferred_end_date` date DEFAULT NULL,
  `number_of_people` int(11) DEFAULT 1,
  `budget` decimal(12,2) DEFAULT 0.00,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `custom_tour_destinations`
--

CREATE TABLE `custom_tour_destinations` (
  `id` bigint(20) NOT NULL,
  `custom_tour_id` bigint(20) NOT NULL,
  `location_id` int(11) NOT NULL,
  `day_order` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `custom_tour_guides`
--

CREATE TABLE `custom_tour_guides` (
  `id` bigint(20) NOT NULL,
  `custom_tour_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `role` varchar(100) DEFAULT 'guide',
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `custom_tour_services`
--

CREATE TABLE `custom_tour_services` (
  `id` bigint(20) NOT NULL,
  `custom_tour_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL,
  `qty` int(11) DEFAULT 1,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `full_name` varchar(200) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `status` enum('active','inactive','on_leave') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `full_name`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Trần Thị B', '0909888777', 'active', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(2, 2, 'Trần Thị B', '0909888777', 'active', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(3, 3, 'Trần Thị B', '0909888777', 'active', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(4, 4, 'Lê Văn C', '0911222333', 'active', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(5, 5, 'Phạm Minh D', '0988666555', 'active', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(6, NULL, 'ê Văn C	', '0911222333', 'on_leave', '2025-10-31 07:15:05', '2025-10-31 07:15:05'),
(7, 7, '0911222333', '0911222333', 'active', '2025-10-31 08:08:47', '2025-10-31 08:08:47'),
(8, 8, '0909888777', '0909888777', 'active', '2025-10-31 08:09:49', '2025-10-31 08:09:49');

-- --------------------------------------------------------

--
-- Table structure for table `employee_schedules`
--

CREATE TABLE `employee_schedules` (
  `id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `tour_id` bigint(20) NOT NULL,
  `schedule_date` date NOT NULL,
  `start_time` time DEFAULT '08:00:00',
  `end_time` time DEFAULT '18:00:00',
  `shift` enum('morning','afternoon','full-day') DEFAULT 'full-day',
  `status` enum('scheduled','working','completed','cancelled') DEFAULT 'scheduled',
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `invoice_no` varchar(100) NOT NULL,
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount` decimal(12,2) NOT NULL,
  `tax` decimal(12,2) DEFAULT 0.00,
  `status` enum('issued','cancelled','paid') DEFAULT 'issued'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `booking_id`, `invoice_no`, `issued_at`, `amount`, `tax`, `status`) VALUES
(1, 1, 'INV001', '2025-10-31 06:38:09', 10800000.00, 0.00, 'issued');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `country`, `region`, `description`) VALUES
(1, 'Hà Nội', 'Việt Nam', 'Miền Bắc', 'Thủ đô ngàn năm văn hiến'),
(2, 'Đà Nẵng', 'Việt Nam', 'Miền Trung', 'Thành phố đáng sống'),
(3, 'TP. Hồ Chí Minh', 'Việt Nam', 'Miền Nam', 'Trung tâm kinh tế lớn nhất nước');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `paid_by_user_id` bigint(20) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('cash','bank_transfer','momo','vnpay','card','paypal','other') DEFAULT 'other',
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `transaction_ref` varchar(255) DEFAULT NULL,
  `status` enum('success','failed','pending') DEFAULT 'success'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `paid_by_user_id`, `amount`, `method`, `paid_at`, `transaction_ref`, `status`) VALUES
(1, 1, 2, 10800000.00, 'bank_transfer', '2025-10-31 06:38:09', 'TRANS123456', 'success');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`) VALUES
(1, 'manage_users.add', 'Thêm tài khoản người dùng'),
(2, 'manage_users.edit', 'Chỉnh sửa tài khoản người dùng'),
(3, 'manage_users.delete', 'Xóa tài khoản người dùng'),
(4, 'manage_users.view', 'Xem danh sách người dùng'),
(5, 'manage_roles.add', 'Tạo vai trò mới'),
(6, 'manage_roles.edit', 'Cập nhật vai trò'),
(7, 'manage_roles.delete', 'Xóa vai trò'),
(8, 'manage_roles.view', 'Xem danh sách vai trò'),
(9, 'manage_tours.add', 'Thêm tour du lịch'),
(10, 'manage_tours.edit', 'Chỉnh sửa tour du lịch'),
(11, 'manage_tours.delete', 'Xóa tour du lịch'),
(12, 'manage_tours.view', 'Xem danh sách tour'),
(13, 'manage_schedules.add', 'Thêm lịch trình tour'),
(14, 'manage_schedules.edit', 'Cập nhật lịch trình tour'),
(15, 'manage_schedules.delete', 'Hủy lịch trình tour'),
(16, 'manage_schedules.view', 'Xem lịch trình tour'),
(17, 'manage_bookings.add', 'Tạo booking cho khách hàng'),
(18, 'manage_bookings.edit', 'Cập nhật thông tin booking'),
(19, 'manage_bookings.delete', 'Hủy booking'),
(20, 'manage_bookings.view', 'Xem danh sách booking'),
(21, 'manage_payments.view', 'Xem và xác nhận thanh toán'),
(22, 'manage_payments.refund', 'Xử lý hoàn tiền'),
(23, 'manage_custom_tours.handle', 'Xử lý tour tùy chỉnh theo yêu cầu'),
(24, 'manage_employees.add', 'Thêm nhân viên / hướng dẫn viên'),
(25, 'manage_employees.edit', 'Chỉnh sửa thông tin nhân viên'),
(26, 'manage_employees.view', 'Xem danh sách nhân viên'),
(27, 'manage_locations.add', 'Thêm địa điểm'),
(28, 'manage_locations.edit', 'Chỉnh sửa địa điểm'),
(29, 'manage_locations.view', 'Xem danh sách địa điểm'),
(30, 'manage_services.add', 'Thêm dịch vụ'),
(31, 'manage_services.edit', 'Chỉnh sửa dịch vụ'),
(32, 'manage_services.view', 'Xem danh sách dịch vụ'),
(33, 'manage_invoices.view', 'Xem và quản lý hóa đơn'),
(34, 'view_reports.view', 'Xem báo cáo thống kê'),
(35, 'view_reviews.view', 'Xem và phản hồi đánh giá');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `tour_id` bigint(20) NOT NULL,
  `guide_id` bigint(20) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `tour_id`, `guide_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 5, 'Tour tuyệt vời, hướng dẫn viên nhiệt tình và chu đáo!', '2025-10-31 06:38:09', '2025-10-31 06:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Quản trị viên hệ thống'),
(2, 'manager', 'Quản lý chi nhánh'),
(3, 'operator', 'Điều hành tour'),
(4, 'guide', 'Hướng dẫn viên'),
(5, 'customer', 'Khách hàng');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(2, 24),
(2, 25),
(2, 26),
(2, 34),
(2, 35),
(3, 13),
(3, 14),
(3, 15),
(3, 16),
(3, 17),
(3, 18),
(3, 19),
(3, 20),
(3, 23),
(3, 35),
(4, 35);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) NOT NULL,
  `type` enum('hotel','flight','bus','car','restaurant','ticket','other') DEFAULT 'other',
  `name` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `price` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `type`, `name`, `provider`, `details`, `price`) VALUES
(1, 'hotel', 'Khách sạn Mường Thanh', 'Mường Thanh Group', 'Phòng đôi 3 sao', 800000.00),
(2, 'bus', 'Xe du lịch 29 chỗ', 'Mai Linh Travel', 'Xe đưa đón sân bay và city tour', 500000.00),
(3, 'restaurant', 'Nhà hàng Sen Hồ Tây', 'Sen Group', 'Buffet đặc sản Hà Nội', 300000.00),
(4, '', '300000.00', '300000.00', '300000.00', 300000.00),
(5, '', '300000.00', '300000.00', '300000.00', 300000.00);

-- --------------------------------------------------------

--
-- Table structure for table `service_images`
--

CREATE TABLE `service_images` (
  `id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL,
  `img_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_images`
--

INSERT INTO `service_images` (`id`, `service_id`, `img_url`, `alt_text`, `uploaded_at`) VALUES
(1, 3, 'uploads/services/1761917364234-993900030.png', NULL, '2025-10-31 13:29:24'),
(2, 5, 'uploads/services/1761917422919-354348393.png', NULL, '2025-10-31 13:30:22');

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `id` bigint(20) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `duration_days` int(11) NOT NULL DEFAULT 1,
  `min_participants` int(11) DEFAULT 1,
  `max_participants` int(11) DEFAULT 30,
  `main_location_id` int(11) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`id`, `code`, `title`, `short_description`, `price`, `duration_days`, `min_participants`, `max_participants`, `main_location_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'HN01', 'Khám phá Hà Nội 3N2Đ', 'Tour tham quan văn hóa và ẩm thực Hà Nội', 3500000.00, 3, 5, 30, 1, 'published', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(2, 'DN01', 'Du lịch Đà Nẵng - Hội An 4N3Đ', 'Trải nghiệm biển xanh và phố cổ', 4500000.00, 4, 5, 25, 2, 'published', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(3, '0909888777', '0909888777', '4500000.00', 4500000.00, 12, 1, 30, 3, 'draft', '2025-10-31 08:46:38', '2025-10-31 08:46:38'),
(4, '3500000.00', '3500000.00', '3500000.00', 3500000.00, 1, 1, 30, 2, 'draft', '2025-10-31 08:55:57', '2025-10-31 08:55:57'),
(5, '35000', '35000', '35000', 35000.00, 1, 1, 30, 2, 'draft', '2025-10-31 09:03:46', '2025-10-31 09:03:46');

-- --------------------------------------------------------

--
-- Table structure for table `tour_guides`
--

CREATE TABLE `tour_guides` (
  `id` bigint(20) NOT NULL,
  `schedule_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `role` varchar(100) DEFAULT 'guide',
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tour_guides`
--

INSERT INTO `tour_guides` (`id`, `schedule_id`, `employee_id`, `role`, `assigned_at`) VALUES
(1, 1, 1, 'lead guide', '2025-10-31 06:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `tour_images`
--

CREATE TABLE `tour_images` (
  `id` bigint(20) NOT NULL,
  `tour_id` bigint(20) NOT NULL,
  `img_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tour_images`
--

INSERT INTO `tour_images` (`id`, `tour_id`, `img_url`) VALUES
(1, 4, 'uploads/tours/1761900957270-66974509.webp'),
(2, 5, 'uploads/tours/1761901426150-268026005.jpg'),
(3, 5, 'uploads/tours/1761901426160-181990800.webp'),
(4, 5, 'uploads/tours/1761901426168-10625054.webp'),
(5, 3, 'uploads/tours/1761915118861-748922750.png'),
(6, 3, 'uploads/tours/1761915123140-476741620.png');

-- --------------------------------------------------------

--
-- Table structure for table `tour_schedules`
--

CREATE TABLE `tour_schedules` (
  `id` bigint(20) NOT NULL,
  `tour_id` bigint(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `seats_total` int(11) NOT NULL,
  `seats_booked` int(11) NOT NULL DEFAULT 0,
  `price_per_person` decimal(12,2) DEFAULT NULL,
  `status` enum('open','full','cancelled','completed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tour_schedules`
--

INSERT INTO `tour_schedules` (`id`, `tour_id`, `start_date`, `end_date`, `seats_total`, `seats_booked`, `price_per_person`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-11-10', '2025-11-12', 30, 5, 3600000.00, 'open', '2025-10-31 06:38:09', '2025-10-31 06:38:09'),
(2, 2, '2025-12-05', '2025-12-08', 25, 10, 4600000.00, 'open', '2025-10-31 06:38:09', '2025-10-31 06:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `tour_services`
--

CREATE TABLE `tour_services` (
  `id` bigint(20) NOT NULL,
  `tour_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL,
  `qty` int(11) DEFAULT 1,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tour_services`
--

INSERT INTO `tour_services` (`id`, `tour_id`, `service_id`, `qty`, `note`) VALUES
(1, 1, 1, 3, '3 đêm khách sạn Mường Thanh'),
(2, 1, 2, 1, 'Xe di chuyển suốt tuyến'),
(3, 1, 3, 2, '2 bữa buffet');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 1, 'admin@travelapp.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq', '2025-10-31 06:38:08', '2025-10-31 06:38:08'),
(2, 2, 'manager01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq', '2025-10-31 06:38:08', '2025-10-31 06:38:08'),
(3, 3, 'gui01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq', '2025-10-31 06:38:08', '2025-10-31 06:38:08'),
(4, 4, 'ope01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq', '2025-10-31 06:38:08', '2025-10-31 06:38:08'),
(5, 5, 'cus01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq', '2025-10-31 06:38:08', '2025-10-31 06:38:08'),
(6, 5, 'cus02@gmail.com', '', '2025-10-31 06:44:12', '2025-10-31 06:44:12'),
(7, 4, 'kv2@gmail.com', '', '2025-10-31 08:08:47', '2025-10-31 08:45:41'),
(8, 2, '12@g.m', '', '2025-10-31 08:09:49', '2025-10-31 08:09:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_code` (`booking_code`),
  ADD KEY `fk_booking_customer` (`customer_id`),
  ADD KEY `fk_booking_schedule` (`schedule_id`),
  ADD KEY `fk_booking_custom_tour` (`custom_tour_id`);

--
-- Indexes for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_passenger_booking` (`booking_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_customers_user` (`user_id`);

--
-- Indexes for table `custom_tours`
--
ALTER TABLE `custom_tours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_custom_tour_customer` (`customer_id`);

--
-- Indexes for table `custom_tour_destinations`
--
ALTER TABLE `custom_tour_destinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ctd_custom_tour` (`custom_tour_id`),
  ADD KEY `fk_ctd_location` (`location_id`);

--
-- Indexes for table `custom_tour_guides`
--
ALTER TABLE `custom_tour_guides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ctg_custom_tour` (`custom_tour_id`),
  ADD KEY `fk_ctg_employee` (`employee_id`);

--
-- Indexes for table `custom_tour_services`
--
ALTER TABLE `custom_tour_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cts_custom_tour` (`custom_tour_id`),
  ADD KEY `fk_cts_service` (`service_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employees_user` (`user_id`);

--
-- Indexes for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_emp_sched` (`employee_id`,`tour_id`,`schedule_date`),
  ADD KEY `fk_emp_sched_tour` (`tour_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_no` (`invoice_no`),
  ADD KEY `fk_invoice_booking` (`booking_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payment_booking` (`booking_id`),
  ADD KEY `fk_payment_user` (`paid_by_user_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_review` (`booking_id`,`customer_id`,`tour_id`,`guide_id`),
  ADD KEY `fk_rv_customer` (`customer_id`),
  ADD KEY `fk_rv_tour` (`tour_id`),
  ADD KEY `fk_rv_guide` (`guide_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `fk_rp_permission` (`permission_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_images`
--
ALTER TABLE `service_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_service_image` (`service_id`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `fk_tours_location` (`main_location_id`);

--
-- Indexes for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_schedule_employee` (`schedule_id`,`employee_id`),
  ADD KEY `fk_tg_employee` (`employee_id`);

--
-- Indexes for table `tour_images`
--
ALTER TABLE `tour_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour` (`tour_id`);

--
-- Indexes for table `tour_schedules`
--
ALTER TABLE `tour_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_schedule_tour` (`tour_id`);

--
-- Indexes for table `tour_services`
--
ALTER TABLE `tour_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_tour_service` (`tour_id`,`service_id`),
  ADD KEY `fk_ts_service` (`service_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_role` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `custom_tours`
--
ALTER TABLE `custom_tours`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `custom_tour_destinations`
--
ALTER TABLE `custom_tour_destinations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `custom_tour_guides`
--
ALTER TABLE `custom_tour_guides`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `custom_tour_services`
--
ALTER TABLE `custom_tour_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `service_images`
--
ALTER TABLE `service_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tour_guides`
--
ALTER TABLE `tour_guides`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tour_images`
--
ALTER TABLE `tour_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tour_schedules`
--
ALTER TABLE `tour_schedules`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tour_services`
--
ALTER TABLE `tour_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_booking_custom_tour` FOREIGN KEY (`custom_tour_id`) REFERENCES `custom_tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `tour_schedules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD CONSTRAINT `fk_passenger_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `custom_tours`
--
ALTER TABLE `custom_tours`
  ADD CONSTRAINT `fk_custom_tour_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_tour_destinations`
--
ALTER TABLE `custom_tour_destinations`
  ADD CONSTRAINT `fk_ctd_custom_tour` FOREIGN KEY (`custom_tour_id`) REFERENCES `custom_tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ctd_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_tour_guides`
--
ALTER TABLE `custom_tour_guides`
  ADD CONSTRAINT `fk_ctg_custom_tour` FOREIGN KEY (`custom_tour_id`) REFERENCES `custom_tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ctg_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_tour_services`
--
ALTER TABLE `custom_tour_services`
  ADD CONSTRAINT `fk_cts_custom_tour` FOREIGN KEY (`custom_tour_id`) REFERENCES `custom_tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cts_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  ADD CONSTRAINT `fk_emp_sched_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_emp_sched_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_invoice_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`paid_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_rv_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rv_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rv_guide` FOREIGN KEY (`guide_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rv_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_images`
--
ALTER TABLE `service_images`
  ADD CONSTRAINT `fk_service_image` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `fk_tours_location` FOREIGN KEY (`main_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD CONSTRAINT `fk_tg_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tg_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `tour_schedules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_images`
--
ALTER TABLE `tour_images`
  ADD CONSTRAINT `fk_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_schedules`
--
ALTER TABLE `tour_schedules`
  ADD CONSTRAINT `fk_schedule_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_services`
--
ALTER TABLE `tour_services`
  ADD CONSTRAINT `fk_ts_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ts_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

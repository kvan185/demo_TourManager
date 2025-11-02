USE travel_app;

-- === PERMISSIONS ===
INSERT INTO permissions (name, description) VALUES
('manage_users.add', 'Thêm tài khoản người dùng'),
('manage_users.edit', 'Chỉnh sửa tài khoản người dùng'),
('manage_users.delete', 'Xóa tài khoản người dùng'),
('manage_users.view', 'Xem danh sách người dùng'),

('manage_roles.add', 'Tạo vai trò mới'),
('manage_roles.edit', 'Cập nhật vai trò'),
('manage_roles.delete', 'Xóa vai trò'),
('manage_roles.view', 'Xem danh sách vai trò'),

('manage_tours.add', 'Thêm tour du lịch'),
('manage_tours.edit', 'Chỉnh sửa tour du lịch'),
('manage_tours.delete', 'Xóa tour du lịch'),
('manage_tours.view', 'Xem danh sách tour'),

('manage_schedules.add', 'Thêm lịch trình tour'),
('manage_schedules.edit', 'Cập nhật lịch trình tour'),
('manage_schedules.delete', 'Hủy lịch trình tour'),
('manage_schedules.view', 'Xem lịch trình tour'),

('manage_bookings.add', 'Tạo booking cho khách hàng'),
('manage_bookings.edit', 'Cập nhật thông tin booking'),
('manage_bookings.delete', 'Hủy booking'),
('manage_bookings.view', 'Xem danh sách booking'),

('manage_payments.view', 'Xem và xác nhận thanh toán'),
('manage_payments.refund', 'Xử lý hoàn tiền'),

('manage_custom_tours.handle', 'Xử lý tour tùy chỉnh theo yêu cầu'),

('manage_employees.add', 'Thêm nhân viên / hướng dẫn viên'),
('manage_employees.edit', 'Chỉnh sửa thông tin nhân viên'),
('manage_employees.view', 'Xem danh sách nhân viên'),

('manage_locations.add', 'Thêm địa điểm'),
('manage_locations.edit', 'Chỉnh sửa địa điểm'),
('manage_locations.view', 'Xem danh sách địa điểm'),

('manage_services.add', 'Thêm dịch vụ'),
('manage_services.edit', 'Chỉnh sửa dịch vụ'),
('manage_services.view', 'Xem danh sách dịch vụ'),

('manage_invoices.view', 'Xem và quản lý hóa đơn'),
('view_reports.view', 'Xem báo cáo thống kê'),
('view_reviews.view', 'Xem và phản hồi đánh giá');

-- === ROLES ===
INSERT INTO roles (name, description) VALUES
('admin', 'Quản trị viên hệ thống'),
('manager', 'Quản lý chi nhánh'),
('operator', 'Điều hành tour'),
('guide', 'Hướng dẫn viên'),
('customer', 'Khách hàng');

-- === ROLE PERMISSIONS ===
-- Admin: toàn quyền
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Manager: quyền quản lý (tours, schedules, bookings, employees, payments, reports, reviews)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions
WHERE name LIKE 'manage_tours.%'
   OR name LIKE 'manage_schedules.%'
   OR name LIKE 'manage_bookings.%'
   OR name LIKE 'manage_employees.%'
   OR name LIKE 'manage_payments.%'
   OR name LIKE 'view_reports.%'
   OR name LIKE 'view_reviews.%';

-- Operator: quyền điều hành (schedules, bookings, custom tours, reviews)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions
WHERE name LIKE 'manage_schedules.%'
   OR name LIKE 'manage_bookings.%'
   OR name LIKE 'manage_custom_tours.%'
   OR name LIKE 'view_reviews.%';

-- Guide: chỉ xem review (có thể mở rộng)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions
WHERE name LIKE 'view_reviews.%';

-- === USERS ===
INSERT INTO users (role_id, email, password_hash) VALUES
(1, 'admin@travelapp.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(2, 'manager01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(3, 'gui01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(4, 'ope01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq');

-- === CUSTOMERS ===
INSERT INTO customers (user_id, full_name, phone, birthday, gender, address, note)
VALUES
(5, 'Nguyễn Văn A', '0905123456', '1995-04-12', 'male', 'Hà Nội', 'Khách VIP');

-- === EMPLOYEES ===
INSERT INTO employees (user_id, full_name, phone, status)
VALUES
(1, 'Trần Thị B', '0909888777', 'active'),
(2, 'Trần Thị B', '0909888777', 'active'),
(3, 'Trần Thị B', '0909888777', 'active'),
(4, 'Lê Văn C', '0911222333', 'active'),
(5, 'Phạm Minh D', '0988666555', 'active');

-- === LOCATIONS ===
INSERT INTO locations (name, country, region, description)
VALUES
('Hà Nội', 'Việt Nam', 'Miền Bắc', 'Thủ đô ngàn năm văn hiến'),
('Đà Nẵng', 'Việt Nam', 'Miền Trung', 'Thành phố đáng sống'),
('TP. Hồ Chí Minh', 'Việt Nam', 'Miền Nam', 'Trung tâm kinh tế lớn nhất nước');

-- === TOURS ===
INSERT INTO tours (code, title, short_description, price, duration_days, min_participants, max_participants, main_location_id, status)
VALUES
('HN01', 'Khám phá Hà Nội 3N2Đ', 'Tour tham quan văn hóa và ẩm thực Hà Nội', 3500000, 3, 5, 30, 1, 'published'),
('DN01', 'Du lịch Đà Nẵng - Hội An 4N3Đ', 'Trải nghiệm biển xanh và phố cổ', 4500000, 4, 5, 25, 2, 'published');

-- === TOUR SCHEDULES ===
INSERT INTO tour_schedules (tour_id, start_date, end_date, seats_total, seats_booked, price_per_person, status)
VALUES
(1, '2025-11-10', '2025-11-12', 30, 5, 3600000, 'open'),
(2, '2025-12-05', '2025-12-08', 25, 10, 4600000, 'open');

-- === SERVICES ===
INSERT INTO services (type, name, provider, details, price)
VALUES
('hotel', 'Khách sạn Mường Thanh', 'Mường Thanh Group', 'Phòng đôi 3 sao', 800000),
('bus', 'Xe du lịch 29 chỗ', 'Mai Linh Travel', 'Xe đưa đón sân bay và city tour', 500000),
('restaurant', 'Nhà hàng Sen Hồ Tây', 'Sen Group', 'Buffet đặc sản Hà Nội', 300000);

-- === TOUR SERVICES ===
INSERT INTO tour_services (tour_id, service_id, qty, note)
VALUES
(1, 1, 3, '3 đêm khách sạn Mường Thanh'),
(1, 2, 1, 'Xe di chuyển suốt tuyến'),
(1, 3, 2, '2 bữa buffet');

-- === TOUR GUIDES ===
INSERT INTO tour_guides (schedule_id, employee_id, role)
VALUES
(1, 1, 'lead guide');

-- === BOOKINGS ===
INSERT INTO bookings (booking_code, customer_id, schedule_id, qty_adults, qty_children, total_amount, status, payment_status, note)
VALUES
('BK001', 1, 1, 2, 1, 10800000, 'confirmed', 'paid', 'Gia đình có trẻ nhỏ'),
('BK002', 1, 2, 1, 0, 4600000, 'pending', 'unpaid', NULL);

-- === BOOKING PASSENGERS ===
INSERT INTO booking_passengers (booking_id, full_name, gender, birth_date, passport_number, seat_type, price)
VALUES
(1, 'Nguyễn Văn A', 'male', '1995-04-12', 'C1234567', 'Người lớn', 3600000),
(1, 'Trần Thị E', 'female', '1997-09-21', 'D7654321', 'Người lớn', 3600000),
(1, 'Nguyễn Văn F', 'male', '2015-01-15', NULL, 'Trẻ em', 1800000);

-- === PAYMENTS ===
INSERT INTO payments (booking_id, paid_by_user_id, amount, method, transaction_ref, status)
VALUES
(1, 2, 10800000, 'bank_transfer', 'TRANS123456', 'success');

-- === INVOICES ===
INSERT INTO invoices (booking_id, invoice_no, amount, tax, status)
VALUES
(1, 'INV001', 10800000, 0, 'issued');

-- === REVIEWS ===
INSERT INTO reviews (booking_id, customer_id, tour_id, guide_id, rating, comment)
VALUES
(1, 1, 1, 1, 5, 'Tour tuyệt vời, hướng dẫn viên nhiệt tình và chu đáo!');

-- Ảnh cho tour
INSERT INTO tour_images (tour_id, img_url, alt_text)
VALUES
(1, '/uploads/tours/hn01-1.jpg', 'Phố cổ Hà Nội'),
(1, '/uploads/tours/hn01-2.jpg', 'Văn Miếu Quốc Tử Giám'),
(2, '/uploads/tours/dn01-1.jpg', 'Biển Mỹ Khê - Đà Nẵng');

-- Ảnh cho service
INSERT INTO service_images (service_id, img_url, alt_text)
VALUES
(1, '/uploads/services/hotel-muongthanh.jpg', 'Khách sạn Mường Thanh'),
(3, '/uploads/services/restaurant-sen.jpg', 'Nhà hàng Sen Hồ Tây');

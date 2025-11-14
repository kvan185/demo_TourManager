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
(5, 'cus01@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus02@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus03@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus04@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus05@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus06@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus07@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus08@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus09@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus10@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus11@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus12@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus13@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus14@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus15@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus16@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus17@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus18@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus19@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus20@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus21@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus22@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus23@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus24@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus25@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq'),
(5, 'cus26@gmail.com', '$2b$10$uDvJNtQ1a6C0n3blP0BfcOGI4KQO5Y9tUD/HldAgvQiCOv0LPMaHq');

-- === CUSTOMERS ===
INSERT INTO customers (user_id, full_name, phone, birthday, gender, address, note)
VALUES
(5, 'Nguyễn Văn Anh', '0905123456', '1995-04-12', 'male', 'Hà Nội', 'Khách VIP'),
(6, 'Trần Thị Bính Hoe', '0905987654', '1993-09-15', 'female', 'Hà Nội', ''),
(7, 'Lê Văn Cảnh', '0912345678', '1987-03-21', 'male', 'Hồ Chí Minh', ''),
(8, 'Phạm Dung', '0987654321', '1990-05-10', 'female', 'Đà Nẵng', ''),
(9, 'Nguyễn Hoà An', '0905123456', '1995-04-12', 'male', 'Hà Nội', 'Khách VIP'),
(10, 'Phạm Quốc Hưng', '0912345001', '1990-01-05', 'male', 'Hà Nội', ''),
(11, 'Trần Thu Hà', '0912345002', '1994-02-11', 'female', 'Hồ Chí Minh', ''),
(12, 'Nguyễn Đức Long', '0912345003', '1989-03-22', 'male', 'Đà Nẵng', ''),
(13, 'Võ Thanh Bình', '0912345004', '1992-04-17', 'male', 'Cần Thơ', ''),
(14, 'Tạ Mỹ Linh', '0912345005', '1993-05-29', 'female', 'Hải Phòng', ''),
(15, 'Phan Văn Hải', '0912345006', '1985-06-14', 'male', 'Bình Dương', ''),
(16, 'Mai Anh Thư', '0912345007', '1996-07-03', 'female', 'Đà Nẵng', ''),
(17, 'Đỗ Đức Tâm', '0912345008', '1988-08-08', 'male', 'Hồ Chí Minh', ''),
(18, 'Trịnh Thu Thảo', '0912345009', '1991-09-19', 'female', 'Quảng Ninh', ''),
(19, 'Hoàng Tấn Lộc', '0912345010', '1986-10-10', 'male', 'Hà Nội', ''),
(20, 'Lưu Bảo Ngọc', '0912345011', '1997-11-25', 'female', 'Đồng Nai', ''),
(21, 'Đặng Hoài Nam', '0912345012', '1984-12-02', 'male', 'Huế', ''),
(22, 'Nguyễn Trúc Mai', '0912345013', '1995-02-22', 'female', 'Nha Trang', ''),
(23, 'Phạm Hồng Đạt', '0912345014', '1987-03-30', 'male', 'Hà Nội', ''),
(24, 'Trần Minh Tâm', '0912345015', '1990-06-06', 'male', 'Hải Phòng', ''),
(25, 'Lê Ái Nhi', '0912345016', '1998-08-15', 'female', 'Sài Gòn', ''),
(26, 'Võ Văn Sơn', '0912345017', '1989-05-27', 'male', 'Đà Nẵng', ''),
(27, 'Nguyễn Hải Vân', '0912345018', '1994-12-11', 'female', 'Buôn Ma Thuột', ''),
(28, 'Trịnh Thanh Toàn', '0912345019', '1986-11-09', 'male', 'Long An', ''),
(29, 'Đoàn Thị Hương', '0912345020', '1993-04-04', 'female', 'Hồ Chí Minh', ''),
(30, 'Phạm Nhật Hào', '0912345021', '1988-09-16', 'male', 'Quảng Nam', '');

-- === EMPLOYEES ===
INSERT INTO employees (user_id, full_name, phone, status)
VALUES
(1, 'Nguyễn Văn Tuấn', '0909888777', 'active'),
(2, 'Trần Hoàn Anh', '0909888777', 'active'),
(3, 'Phan Bănh Hoàn', '0909888777', 'active'),
(4, 'Lê Văn Minh', '0911222333', 'active');

-- === LOCATIONS ===
INSERT INTO locations (name, country, region, description)
VALUES
('Hà Nội', 'Việt Nam', 'Miền Bắc', 'Thủ đô ngàn năm văn hiến, trung tâm chính trị – văn hóa của Việt Nam.'),
('Đà Nẵng', 'Việt Nam', 'Miền Trung', 'Thành phố đáng sống với bãi biển Mỹ Khê và cầu Rồng nổi tiếng.'),
('TP. Hồ Chí Minh', 'Việt Nam', 'Miền Nam', 'Trung tâm kinh tế lớn nhất Việt Nam, sôi động và hiện đại.'),
('Hạ Long', 'Việt Nam', 'Miền Bắc', 'Nổi tiếng với vịnh Hạ Long – di sản thiên nhiên thế giới.'),
('Sapa', 'Việt Nam', 'Miền Bắc', 'Thị trấn vùng cao với cảnh quan núi non và văn hóa dân tộc đặc sắc.'),
('Huế', 'Việt Nam', 'Miền Trung', 'Cố đô của Việt Nam, nổi tiếng với quần thể di tích và ẩm thực cung đình.'),
('Nha Trang', 'Việt Nam', 'Miền Trung', 'Thành phố biển với nhiều khu nghỉ dưỡng cao cấp.'),
('Phú Quốc', 'Việt Nam', 'Miền Nam', 'Đảo ngọc với biển xanh, cát trắng và nhiều khu nghỉ dưỡng sang trọng.'),
('Đà Lạt', 'Việt Nam', 'Tây Nguyên', 'Thành phố ngàn hoa, khí hậu mát mẻ quanh năm.'),
('Cần Thơ', 'Việt Nam', 'Miền Tây', 'Thành phố trung tâm vùng đồng bằng sông Cửu Long, nổi tiếng với chợ nổi Cái Răng.'),
('Hội An', 'Việt Nam', 'Miền Trung', 'Phố cổ được UNESCO công nhận là di sản văn hóa thế giới.'),
('Pleiku', 'Việt Nam', 'Tây Nguyên', 'Thành phố cao nguyên yên bình, nhiều thắng cảnh thiên nhiên.');

-- === TOURS ===
INSERT INTO tours (code, title, short_description, price, duration_days, min_participants, max_participants, main_location_id, status)
VALUES
('HN01', 'Khám phá Hà Nội 3N2Đ', 'Tour tham quan văn hóa và ẩm thực Hà Nội', 3500000, 3, 5, 30, 1, 'published'),
('DN01', 'Du lịch Đà Nẵng - Hội An 4N3Đ', 'Trải nghiệm biển xanh và phố cổ', 4500000, 4, 5, 25, 2, 'published'),
('HCM01', 'TP.HCM – Cần Thơ 3N2Đ', 'Khám phá miền Nam và sông nước Cửu Long', 4000000, 3, 5, 30, 3, 'published'),
('HL01', 'Vịnh Hạ Long – Trải nghiệm du thuyền 2N1Đ', 'Khám phá kỳ quan thiên nhiên thế giới', 5000000, 2, 3, 20, 4, 'published'),
('DL01', 'Đà Lạt – Thành phố ngàn hoa 3N2Đ', 'Tham quan Đà Lạt với cảnh quan lãng mạn và mát mẻ', 4200000, 3, 2, 15, 9, 'published');


-- === TOUR SCHEDULES ===
INSERT INTO tour_schedules (tour_id, start_date, end_date, seats_total, seats_booked, price_per_person, status)
VALUES
-- Tour 1: Hà Nội
(1, '2025-11-10', '2025-11-12', 30, 5, 3600000, 'open'),
(1, '2025-11-20', '2025-11-22', 30, 8, 3600000, 'open'),
(1, '2025-12-01', '2025-12-03', 30, 12, 3600000, 'open'),

-- Tour 2: Đà Nẵng - Hội An
(2, '2025-12-05', '2025-12-08', 25, 10, 4600000, 'open'),
(2, '2025-12-15', '2025-12-18', 25, 5, 4600000, 'open'),
(2, '2025-12-25', '2025-12-28', 25, 20, 4600000, 'open'),

-- Tour 3: TP.HCM – Cần Thơ
(3, '2025-11-12', '2025-11-14', 30, 6, 4000000, 'open'),
(3, '2025-11-22', '2025-11-24', 30, 12, 4000000, 'open'),
(3, '2025-12-02', '2025-12-04', 30, 15, 4000000, 'open'),

-- Tour 4: Vịnh Hạ Long
(4, '2025-11-15', '2025-11-16', 20, 5, 5000000, 'open'),
(4, '2025-11-25', '2025-11-26', 20, 10, 5000000, 'open'),
(4, '2025-12-05', '2025-12-06', 20, 15, 5000000, 'open'),

-- Tour 5: Đà Lạt
(5, '2025-11-18', '2025-11-20', 15, 5, 4200000, 'open'),
(5, '2025-11-28', '2025-11-30', 15, 10, 4200000, 'open'),
(5, '2025-12-08', '2025-12-10', 15, 12, 4200000, 'open');

-- === TOUR ITINERARIES: Lịch trình chi tiết theo ngày ===
INSERT INTO tour_itineraries (tour_id, day_number, title, description)
VALUES
-- 🔹 Tour 1: Hà Nội 3N2Đ
(1, 1, 'Ngày 1: Văn Miếu – Hồ Hoàn Kiếm', 
 'Đón khách tại khách sạn, tham quan Văn Miếu Quốc Tử Giám, hồ Hoàn Kiếm và phố cổ. Ăn tối tại nhà hàng Sen Hồ Tây.'),
(1, 2, 'Ngày 2: Phố cổ Hà Nội – Chùa Trấn Quốc', 
 'Buổi sáng dạo phố cổ, thưởng thức phở Hà Nội. Chiều tham quan chùa Trấn Quốc và Hồ Tây.'),
(1, 3, 'Ngày 3: Làng gốm Bát Tràng – Kết thúc tour', 
 'Tham quan làng gốm truyền thống Bát Tràng, trải nghiệm làm gốm thủ công, sau đó tiễn khách ra sân bay.'),

-- 🔹 Tour 2: Đà Nẵng - Hội An 4N3Đ
(2, 1, 'Ngày 1: Bà Nà Hills – Cầu Vàng', 
 'Tham quan khu du lịch Bà Nà Hills, chụp ảnh tại Cầu Vàng, ăn tối tại khách sạn.'),
(2, 2, 'Ngày 2: Biển Mỹ Khê – Ngũ Hành Sơn', 
 'Buổi sáng tắm biển Mỹ Khê, chiều tham quan chùa Linh Ứng và mua sắm đặc sản.'),
(2, 3, 'Ngày 3: Phố cổ Hội An – Đêm đèn lồng', 
 'Khám phá phố cổ Hội An, dạo phố, ăn tối bên sông Hoài, thưởng thức ẩm thực địa phương.'),
(2, 4, 'Ngày 4: Chợ Hàn – Tiễn khách', 
 'Mua sắm tại chợ Hàn, sau đó đưa khách ra sân bay. Kết thúc chương trình.'),

-- 🔹 Tour 3: TP.HCM – Cần Thơ 3N2Đ
(3, 1, 'Ngày 1: TP.HCM – Bến Nhà Rồng', 
 'Đón khách, tham quan Bến Nhà Rồng, Nhà Thờ Đức Bà, ăn tối tại quận 1.'),
(3, 2, 'Ngày 2: Cần Thơ – Chợ nổi Cái Răng', 
 'Di chuyển tới Cần Thơ, tham quan chợ nổi, thưởng thức đặc sản miền Tây.'),
(3, 3, 'Ngày 3: Vườn trái cây – Kết thúc tour', 
 'Tham quan vườn trái cây, trải nghiệm nông nghiệp địa phương, sau đó tiễn khách ra sân bay.'),

-- 🔹 Tour 4: Vịnh Hạ Long 2N1Đ
(4, 1, 'Ngày 1: Hạ Long – Du thuyền', 
 'Đón khách tại Hạ Long, lên du thuyền tham quan vịnh, ăn tối trên thuyền.'),
(4, 2, 'Ngày 2: Hang Sửng Sốt – Tiễn khách', 
 'Tham quan Hang Sửng Sốt, tắm biển hoặc chèo kayak, sau đó đưa khách ra bến tàu và kết thúc tour.'),

-- 🔹 Tour 5: Đà Lạt 3N2Đ
(5, 1, 'Ngày 1: Hồ Xuân Hương – Chợ Đà Lạt', 
 'Đón khách, tham quan Hồ Xuân Hương, dạo chợ Đà Lạt, ăn tối tại nhà hàng địa phương.'),
(5, 2, 'Ngày 2: Thung Lũng Tình Yêu – Vườn hoa Thành Phố', 
 'Tham quan Thung Lũng Tình Yêu, vườn hoa thành phố, chụp ảnh và trải nghiệm cafe địa phương.'),
(5, 3, 'Ngày 3: Đồi chè Cầu Đất – Kết thúc tour', 
 'Tham quan đồi chè Cầu Đất, tham gia hái chè, sau đó tiễn khách ra sân bay.');

-- === SERVICES ===
INSERT INTO services (type, name, provider, details, price)
VALUES
-- HOTEL
('hotel', 'Khách sạn Mường Thanh', 'Mường Thanh Group', 'Phòng đôi 3 sao', 800000),
('hotel', 'Vinpearl Resort Nha Trang', 'Vingroup', 'Phòng hướng biển 5 sao', 3200000),

-- BUS
('bus', 'Xe giường nằm cao cấp', 'Phương Trang', 'Tuyến Sài Gòn – Đà Lạt', 350000),
('bus', 'Xe limousine 9 chỗ', 'Thành Bưởi', 'Dịch vụ đưa đón cao cấp', 450000),

-- RESTAURANT
('restaurant', 'Nhà hàng Sen Hồ Tây', 'Sen Group', 'Buffet đặc sản Hà Nội', 300000),
('restaurant', 'Nhà hàng Hải Sản Biển Đông', 'Biển Đông Group', 'Hải sản tươi sống', 500000),

-- FLIGHT
('flight', 'Vé máy bay Hà Nội - Sài Gòn', 'Vietnam Airlines', 'Ghế phổ thông, bao gồm 20kg hành lý', 2500000),
('flight', 'Vé máy bay Đà Nẵng - Singapore', 'VietJet Air', 'Vé khứ hồi, không bao gồm hành lý ký gửi', 3800000),

-- CAR
('car', 'Thuê xe 7 chỗ Toyota Innova', 'Vinasun', 'Thuê theo ngày, đã bao gồm tài xế', 900000),
('car', 'Thuê xe tự lái Kia Morning', 'Dịch vụ MyCar', 'Thuê theo giờ, không bao gồm xăng', 200000),

-- TICKET
('ticket', 'Vé vào VinWonders Nha Trang', 'VinWonders', 'Vé ngày, bao gồm tất cả trò chơi', 950000),
('ticket', 'Vé tham quan Bà Nà Hills', 'Sun Group', 'Vé khứ hồi cáp treo + buffet', 1200000),

-- OTHER
('other', 'Dịch vụ spa & massage 60 phút', 'Lá Spa', 'Gói thư giãn toàn thân', 450000),
('other', 'Hướng dẫn viên du lịch riêng', 'Saigontourist', 'Nói tiếng Anh, theo tour trong ngày', 800000);

-- === TOUR SERVICES ===
INSERT INTO tour_services (tour_id, service_id, qty, note)
VALUES
-- HN01 (tour_id = 1)
(1, 1, 2, '2 đêm khách sạn Mường Thanh'),
(1, 6, 3, 'Xe limousine đưa đón 3 ngày'),
(1, 9, 1, '1 bữa buffet tại Sen Hồ Tây'),
(1, 12, 1, 'Vé tham quan điểm du lịch'),
(1, 14, 1, 'Hướng dẫn viên theo tour'),

-- DN01 (tour_id = 2)
(2, 2, 3, '3 đêm tại Vinpearl Resort'),
(2, 5, 4, 'Xe đưa đón 4 ngày'),
(2, 10, 1, '1 bữa hải sản tại Biển Đông'),
(2, 11, 1, 'Vé vào VinWonders Nha Trang'),
(2, 14, 1, 'Hướng dẫn viên suốt tour'),

-- HCM01 (tour_id = 3)
(3, 5, 3, 'Xe giường nằm tuyến TP.HCM - Cần Thơ 2 chiều'),
(3, 8, 1, 'Thuê xe tự lái 1 ngày tham quan thành phố'),
(3, 9, 1, 'Bữa tối tại Nhà hàng Cơm Niêu'),
(3, 13, 1, 'Gói spa thư giãn cho khách'),
(3, 14, 1, 'Hướng dẫn viên theo đoàn'),

-- HL01 (tour_id = 4)
(4, 1, 1, '1 đêm khách sạn trước khi lên du thuyền'),
(4, 6, 2, 'Xe limousine đưa đón 2 chiều'),
(4, 10, 1, 'Bữa hải sản trên thuyền'),
(4, 11, 1, 'Vé tham quan Vịnh Hạ Long'),
(4, 14, 1, 'Hướng dẫn viên chuyên tuyến Hạ Long'),

-- DL01 (tour_id = 5)
(5, 2, 2, '2 đêm lưu trú tại Vinpearl Đà Lạt'),
(5, 5, 2, 'Xe đưa đón tham quan 2 ngày'),
(5, 9, 1, 'Bữa tối đặc sản tại Cơm Niêu'),
(5, 13, 1, 'Gói spa thư giãn tại Đà Lạt'),
(5, 14, 1, 'Hướng dẫn viên suốt hành trình');

-- === TOUR GUIDES ===
INSERT INTO tour_guides (schedule_id, employee_id, role)
VALUES
(1, 2, 'lead guide'),
(1, 4, 'assistant guide'),
(2, 1, 'lead guide'),
(2, 2, 'assistant guide'),
(3, 3, 'lead guide'),
(3, 2, 'assistant guide'),
(4, 4, 'lead guide'),
(4, 1, 'assistant guide'),
(5, 2, 'lead guide'),
(5, 3, 'assistant guide');

-- === BOOKINGS ===
INSERT INTO bookings ( booking_code, customer_id, schedule_id, custom_tour_id, booking_date, qty_adults, qty_children, total_amount, status, payment_status, refund_note, refunded_at, note )
VALUES
('BK001', 1, 1, NULL, '2025-01-12', 2, 1, 10800000.00, 'confirmed', 'paid', NULL, NULL, 'Gia đình có trẻ nhỏ'),
('BK002', 2, 2, NULL, '2025-01-28', 1, 0, 4600000.00, 'pending', 'unpaid', NULL, NULL, 'Khách lẻ'),
('BK003', 3, 3, NULL, '2025-02-05', 2, 2, 15200000.00, 'confirmed', 'paid', NULL, NULL, 'Gia đình 4 người'),
('BK004', 4, 4, NULL, '2025-02-18', 1, 1, 7600000.00, 'cancelled', 'refunded', 'Khách hủy do mưa bão', '2025-02-20', 'Khách hủy tour'),
('BK005', 5, 5, NULL, '2025-03-02', 3, 0, 13800000.00, 'completed', 'paid', NULL, NULL, 'Đặt theo nhóm bạn'),
('BK006', 6, 6, NULL, '2025-03-11', 2, 0, 9400000.00, 'confirmed', 'paid', NULL, NULL, 'Khách đặt qua điện thoại'),
('BK007', 7, 1, NULL, '2025-03-22', 1, 0, 4800000.00, 'confirmed', 'paid', NULL, NULL, 'Tour đặt riêng 1 ngày'),
('BK008', 8, 2, NULL, '2025-04-01', 4, 2, 22800000.00, 'completed', 'paid', NULL, NULL, 'Gia đình đi nghỉ hè'),
('BK009', 9, 1, NULL, '2025-04-13', 1, 1, 7200000.00, 'pending', 'unpaid', NULL, NULL, 'Khách mới lần đầu'),
('BK010', 10, 2, NULL, '2025-04-26', 2, 0, 9200000.00, 'cancelled', 'unpaid', 'Khách hủy do bận việc', NULL, 'Khách hủy cận ngày'),
('BK011', 11, 3, NULL, '2025-05-03', 3, 1, 17200000.00, 'confirmed', 'paid', NULL, NULL, 'Gia đình 4 người, có trẻ nhỏ'),
('BK012', 12, 3, NULL, '2025-05-12', 1, 0, 4500000.00, 'pending', 'unpaid', NULL, NULL, 'Khách cá nhân'),
('BK013', 13, 4, NULL, '2025-05-20', 2, 0, 9100000.00, 'confirmed', 'paid', NULL, NULL, 'Đặt online'),
('BK014', 14, 5, NULL, '2025-05-30', 1, 0, 4700000.00, 'completed', 'paid', NULL, NULL, 'Khách quen'),
('BK015', 15, 4, NULL, '2025-06-05', 2, 1, 11800000.00, 'pending', 'unpaid', NULL, NULL, 'Đặt qua ứng dụng'),
('BK016', 16, 5, NULL, '2025-06-14', 4, 0, 18400000.00, 'confirmed', 'paid', NULL, NULL, 'Nhóm công ty du lịch'),
('BK017', 17, 6, NULL, '2025-06-22', 1, 0, 4500000.00, 'completed', 'paid', NULL, NULL, 'Khách lẻ'),
('BK018', 18, 6, NULL, '2025-07-01', 2, 1, 11200000.00, 'pending', 'unpaid', NULL, NULL, 'Khách chờ xác nhận'),
('BK019', 19, 1, NULL, '2025-07-09', 3, 2, 19600000.00, 'confirmed', 'paid', NULL, NULL, 'Gia đình đông người'),
('BK020', 20, 2, NULL, '2025-07-21', 2, 0, 8800000.00, 'cancelled', 'refunded', 'Thay đổi kế hoạch', '2025-07-22', 'Khách xin hoàn tiền'),
('BK021', 21, 1, NULL, '2025-08-02', 1, 0, 4700000.00, 'completed', 'paid', NULL, NULL, 'Khách quen cũ'),
('BK022', 22, 3, NULL, '2025-08-11', 2, 1, 10900000.00, 'pending', 'unpaid', NULL, NULL, 'Khách đi công tác'),
('BK023', 23, 4, NULL, '2025-08-22', 1, 0, 4600000.00, 'confirmed', 'paid', NULL, NULL, 'Khách đặt sớm'),
('BK024', 24, 5, NULL, '2025-09-03', 3, 0, 13200000.00, 'completed', 'paid', NULL, NULL, 'Nhóm bạn trẻ');

-- === BOOKING PASSENGERS ===
INSERT INTO booking_passengers (booking_id, full_name, gender, birth_date, passport_number, seat_type, price)
VALUES
-- Booking 1: Gia đình 3 người
(1, 'Nguyễn Văn A', 'male', '1990-05-10', 'C1234567', 'Người lớn', 3600000),
(1, 'Trần Thị B', 'female', '1993-09-15', 'D7654321', 'Người lớn', 3600000),
(1, 'Nguyễn Văn C', 'male', '2015-01-15', NULL, 'Trẻ em', 1800000),

-- Booking 2: Khách lẻ
(2, 'Phạm Văn D', 'male', '1987-03-21', 'E999888', 'Người lớn', 4600000),

-- Booking 3: Gia đình 4 người
(3, 'Lê Thị Hoa', 'female', '1985-07-12', 'F223344', 'Người lớn', 3800000),
(3, 'Nguyễn Văn Hùng', 'male', '1983-02-20', 'G667788', 'Người lớn', 3800000),
(3, 'Nguyễn Minh Khang', 'male', '2012-10-25', NULL, 'Trẻ em', 1900000),
(3, 'Nguyễn Lan Anh', 'female', '2016-08-11', NULL, 'Trẻ em', 1900000),

-- Booking 4: 2 người
(4, 'Trần Quốc Tuấn', 'male', '1992-09-17', 'H998877', 'Người lớn', 3800000),
(4, 'Lê Thị Mai', 'female', '1995-12-03', 'I556677', 'Người lớn', 3800000),

-- Booking 5: 3 người
(5, 'Vũ Văn Hào', 'male', '1980-03-14', 'J123987', 'Người lớn', 4600000),
(5, 'Nguyễn Thị Hà', 'female', '1984-07-09', 'K654321', 'Người lớn', 4600000),
(5, 'Vũ Hoàng Anh', 'male', '2014-05-01', NULL, 'Trẻ em', 2300000),

-- Booking 6: 2 người
(6, 'Phạm Minh Đức', 'male', '1989-06-10', 'L554433', 'Người lớn', 4700000),
(6, 'Hoàng Thị Kim', 'female', '1991-11-27', 'M889900', 'Người lớn', 4700000),

-- Booking 7: 1 người
(7, 'Nguyễn Văn Lợi', 'male', '1994-03-18', 'N223311', 'Người lớn', 4800000),

-- Booking 8: 4 người
(8, 'Lê Thành Nhân', 'male', '1981-08-15', 'P882266', 'Người lớn', 5700000),
(8, 'Phạm Thị Tươi', 'female', '1982-04-05', 'P882267', 'Người lớn', 5700000),
(8, 'Lê Thị Thảo', 'female', '2010-01-09', NULL, 'Trẻ em', 2850000),
(8, 'Lê Huy Hoàng', 'male', '2014-07-20', NULL, 'Trẻ em', 2850000),

-- Booking 9: 2 người
(9, 'Trần Văn Sơn', 'male', '1993-06-14', 'Q999666', 'Người lớn', 3600000),
(9, 'Nguyễn Thị Linh', 'female', '1997-08-22', 'R777555', 'Người lớn', 3600000),

-- Booking 10: 3 người
(10, 'Võ Văn Đạt', 'male', '1985-05-06', 'S222111', 'Người lớn', 4000000),
(10, 'Trần Thị Mỹ', 'female', '1987-02-11', 'T333444', 'Người lớn', 4000000),
(10, 'Võ Quang Bảo', 'male', '2013-09-30', NULL, 'Trẻ em', 1200000),

-- Booking 11: 1 người
(11, 'Nguyễn Quốc Khánh', 'male', '1990-04-18', 'U554433', 'Người lớn', 8600000),

-- Booking 12: 2 người
(12, 'Phạm Hữu Phước', 'male', '1988-01-12', 'V667788', 'Người lớn', 2250000),
(12, 'Đặng Thu Hà', 'female', '1992-11-23', 'V667789', 'Người lớn', 2250000),

-- Booking 13: 2 người
(13, 'Nguyễn Văn Hòa', 'male', '1986-07-16', 'W223344', 'Người lớn', 4550000),
(13, 'Phạm Mỹ Duyên', 'female', '1991-03-29', 'X667788', 'Người lớn', 4550000),

-- Booking 14: 1 người
(14, 'Trần Văn Tình', 'male', '1995-05-11', 'Y889900', 'Người lớn', 4700000),

-- Booking 15: 3 người
(15, 'Nguyễn Hữu Hậu', 'male', '1980-10-01', 'Z998877', 'Người lớn', 4000000),
(15, 'Võ Thị Liên', 'female', '1983-12-25', 'AA123456', 'Người lớn', 4000000),
(15, 'Nguyễn Hữu Minh', 'male', '2015-06-09', NULL, 'Trẻ em', 1800000),

-- Booking 16: 4 người
(16, 'Phạm Anh Tuấn', 'male', '1982-09-04', 'AB334455', 'Người lớn', 4600000),
(16, 'Lê Thị Hoa', 'female', '1985-07-22', 'AB334456', 'Người lớn', 4600000),
(16, 'Phạm Bảo Nam', 'male', '2010-03-10', NULL, 'Trẻ em', 2300000),
(16, 'Phạm Bảo Ngọc', 'female', '2016-10-12', NULL, 'Trẻ em', 2300000),

-- Booking 17: 1 người
(17, 'Nguyễn Thanh Bình', 'male', '1991-04-19', 'AC777555', 'Người lớn', 4500000),

-- Booking 18: 2 người
(18, 'Trần Hồng Sơn', 'male', '1988-05-13', 'AD998877', 'Người lớn', 5600000),
(18, 'Phan Thị Trang', 'female', '1990-09-09', 'AD998878', 'Người lớn', 5600000),

-- Booking 19: 4 người
(19, 'Nguyễn Văn Minh', 'male', '1979-03-10', 'AE112233', 'Người lớn', 4900000),
(19, 'Lê Thị Xuân', 'female', '1981-07-21', 'AE112234', 'Người lớn', 4900000),
(19, 'Nguyễn Văn Duy', 'male', '2008-09-13', NULL, 'Trẻ em', 2400000),
(19, 'Nguyễn Thị My', 'female', '2013-11-17', NULL, 'Trẻ em', 2400000),

-- -- Booking 20: 2 người
(20, 'Võ Tấn Lợi', 'male', '1984-02-08', 'AF998822', 'Người lớn', 4400000),
(20, 'Phạm Thị Hằng', 'female', '1987-12-09', 'AF998823', 'Người lớn', 4400000),

-- Booking 21: 2 người
(21, 'Nguyễn Duy Khang', 'male', '1990-06-14', 'AG443322', 'Người lớn', 2350000),
(21, 'Trần Mỹ Linh', 'female', '1993-10-05', 'AG443323', 'Người lớn', 2350000),

-- Booking 22: 3 người
(22, 'Phan Văn Toàn', 'male', '1982-01-15', 'AH667788', 'Người lớn', 3600000),
(22, 'Nguyễn Thị Thảo', 'female', '1985-07-18', 'AH667789', 'Người lớn', 3600000),
(22, 'Phan Ngọc Hân', 'female', '2014-03-03', NULL, 'Trẻ em', 1800000),

-- Booking 23: 3 người
(23, 'Võ Minh Phúc', 'male', '1988-09-10', 'AI554433', 'Người lớn', 4200000),
(23, 'Nguyễn Thị Diễm', 'female', '1989-12-14', 'AI554434', 'Người lớn', 4200000),
(23, 'Võ Thị Hồng', 'female', '2012-04-01', NULL, 'Trẻ em', 2100000),

-- Booking 24: 2 người
(24, 'Trần Văn Hậu', 'male', '1993-07-20', 'AJ998877', 'Người lớn', 4800000),
(24, 'Phạm Thị Hà', 'female', '1995-09-10', 'AJ998878', 'Người lớn', 4800000);

-- === PAYMENTS ===
INSERT INTO payments (booking_id, paid_by_user_id, amount, method, transaction_ref, status)
VALUES
(1,  2, 10800000.00, 'bank_transfer', 'TRANS123456', 'success'),
(2,  2, 4600000.00, 'momo', 'MOMO223456', 'pending'),
(3,  3, 15200000.00, 'vnpay', 'VNP334455', 'success'),
(4,  4, 7600000.00, 'cash', 'CASH445566', 'failed'),
(5,  2, 13800000.00, 'bank_transfer', 'TRANS556677', 'success'),
(6,  3, 9400000.00, 'vnpay', 'VNP667788', 'pending'),
(7,  2, 4800000.00, 'momo', 'MOMO778899', 'success'),
(8,  4, 22800000.00, 'bank_transfer', 'TRANS889900', 'success'),
(9,  5, 7200000.00, 'vnpay', 'VNP990011', 'pending'),
(10, 3, 9200000.00, 'cash', 'CASH111222', 'failed'),
(11, 2, 17200000.00, 'paypal', 'PAY223344', 'success'),
(12, 3, 4500000.00, 'momo', 'MOMO334455', 'success'),
(13, 4, 9100000.00, 'bank_transfer', 'TRANS445566', 'success'),
(14, 5, 4700000.00, 'vnpay', 'VNP556677', 'success'),
(15, 3, 11800000.00, 'cash', 'CASH667788', 'pending'),
(16, 4, 18400000.00, 'bank_transfer', 'TRANS778899', 'success'),
(17, 2, 4500000.00, 'momo', 'MOMO889900', 'success'),
(18, 3, 11200000.00, 'card', 'CARD990011', 'pending'),
(19, 4, 19600000.00, 'bank_transfer', 'TRANS111222', 'success'),
(20, 5, 8800000.00, 'cash', 'CASH222333', 'failed'),
(21, 3, 4700000.00, 'vnpay', 'VNP333444', 'success'),
(22, 2, 10900000.00, 'momo', 'MOMO444555', 'success'),
(23, 3, 12500000.00, 'paypal', 'PAY555666', 'success'),
(24, 4, 9600000.00, 'bank_transfer', 'TRANS666777', 'success');

-- === INVOICES ===
INSERT INTO invoices (booking_id, invoice_no, amount, tax, status)
VALUES
(1,  'INV001', 10800000.00, 0.00, 'issued'),
(2,  'INV002', 4600000.00, 0.00, 'issued'),
(3,  'INV003', 15200000.00, 0.00, 'paid'),
(4,  'INV004', 7600000.00, 0.00, 'cancelled'),
(5,  'INV005', 13800000.00, 0.00, 'paid'),
(6,  'INV006', 9400000.00, 0.00, 'issued'),
(7,  'INV007', 4800000.00, 0.00, 'paid'),
(8,  'INV008', 22800000.00, 0.00, 'paid'),
(9,  'INV009', 7200000.00, 0.00, 'issued'),
(10, 'INV010', 9200000.00, 0.00, 'cancelled'),
(11, 'INV011', 17200000.00, 0.00, 'paid'),
(12, 'INV012', 4500000.00, 0.00, 'issued'),
(13, 'INV013', 9100000.00, 0.00, 'paid'),
(14, 'INV014', 4700000.00, 0.00, 'paid'),
(15, 'INV015', 11800000.00, 0.00, 'issued'),
(16, 'INV016', 18400000.00, 0.00, 'paid'),
(17, 'INV017', 4500000.00, 0.00, 'paid'),
(18, 'INV018', 11200000.00, 0.00, 'issued'),
(19, 'INV019', 19600000.00, 0.00, 'paid'),
(20, 'INV020', 8800000.00, 0.00, 'cancelled'),
(21, 'INV021', 4700000.00, 0.00, 'paid'),
(22, 'INV022', 10900000.00, 0.00, 'issued'),
(23, 'INV023', 12500000.00, 0.00, 'paid'),
(24, 'INV024', 9600000.00, 0.00, 'paid');

-- === REVIEWS ===
INSERT INTO reviews (booking_id, customer_id, tour_id, guide_id, rating, comment)
VALUES
(1, 1, 1, 1, 5, 'Tour tuyệt vời, hướng dẫn viên nhiệt tình và chu đáo!'),
(2, 1, 2, 1, 4, 'Tour khá tốt, nhưng thời gian hơi ngắn.'),
(3, 2, 1, 1, 5, 'Rất hài lòng với lịch trình và dịch vụ.'),
(4, 3, 3, 1, 3, 'Hướng dẫn viên ổn, nhưng chỗ ăn uống chưa hợp khẩu vị.'),
(5, 2, 2, 1, 4, 'Tour đẹp, nhưng thời tiết không thuận lợi.'),
(6, 3, 4, 1, 5, 'Trải nghiệm tuyệt vời, sẽ quay lại!'),
(7, 4, 1, 1, 2, 'Một vài vấn đề về tổ chức, cần cải thiện.'),
(8, 5, 5, 1, 5, 'Hướng dẫn viên rất thân thiện, tour rất vui.'),
(9, 2, 3, 1, 4, 'Hài lòng với dịch vụ, nhưng cần cải thiện vận chuyển.'),
(10, 1, 4, 1, 5, 'Tour xuất sắc, mọi thứ đều hoàn hảo!');

-- Ảnh cho tour
INSERT INTO tour_images (tour_id, img_url, alt_text)
VALUES
-- Tour 1: Hà Nội
(1, 'uploads/tours/hn01.jpg', 'Phố cổ Hà Nội'),
(1, 'uploads/tours/hn02.jpg', 'Văn Miếu Quốc Tử Giám'),
(1, 'uploads/tours/hn03.jpg', 'Hồ Hoàn Kiếm'),
(1, 'uploads/tours/hn04.jpg', 'Làng gốm Bát Tràng'),

-- Tour 2: Đà Nẵng - Hội An
(2, 'uploads/tours/dn01.jpg', 'Bà Nà Hills, Đà Nẵng'),
(2, 'uploads/tours/dn02.jpg', 'Cầu Vàng, Đà Nẵng'),
(2, 'uploads/tours/dn03.jpg', 'Phố cổ Hội An'),
(2, 'uploads/tours/dn04.jpg', 'Biển Mỹ Khê'),

-- Tour 3: TP.HCM – Cần Thơ
(3, 'uploads/tours/hcm01.jpg', 'Nhà thờ Đức Bà, TP.HCM'),
(3, 'uploads/tours/hcm02.jpg', 'Chợ Bến Thành'),
(3, 'uploads/tours/hcm03.jpg', 'Chợ nổi Cái Răng, Cần Thơ'),
(3, 'uploads/tours/hcm04.jpg', 'Vườn trái cây miền Tây'),

-- Tour 4: Vịnh Hạ Long
(4, 'uploads/tours/hl01.jpg', 'Vịnh Hạ Long'),
(4, 'uploads/tours/hl02.jpg', 'Hang Sửng Sốt, Hạ Long'),
(4, 'uploads/tours/hl03.jpg', 'Chèo kayak trên Vịnh Hạ Long'),
(4, 'uploads/tours/hl04.jpg', 'Hoàng hôn trên vịnh'),

-- Tour 5: Đà Lạt
(5, 'uploads/tours/dl01.jpg', 'Hồ Xuân Hương, Đà Lạt'),
(5, 'uploads/tours/dl02.jpg', 'Thung lũng Tình Yêu, Đà Lạt'),
(5, 'uploads/tours/dl03.jpg', 'Vườn hoa thành phố Đà Lạt'),
(5, 'uploads/tours/dl04.jpg', 'Đồi chè Cầu Đất, Đà Lạt');

-- Ảnh cho service
INSERT INTO service_images (service_id, img_url, alt_text)
VALUES
-- Tour 1: Hà Nội (service_id 1-3)
(1, 'uploads/services/hn_hotel01.jpg', 'Khách sạn Mường Thanh, Hà Nội'),
(1, 'uploads/services/hn_hotel02.jpg', 'Phòng nghỉ khách sạn Mường Thanh'),
(3, 'uploads/services/hn_car01.jpg', 'Xe du lịch 16 chỗ Hà Nội'),
(5, 'uploads/services/hn_restaurant01.jpg', 'Buffet tại nhà hàng Sen Hồ Tây'),

-- Tour 2: Đà Nẵng - Hội An (service_id 4-6)
(2, 'uploads/services/dn_hotel01.jpg', 'Khách sạn Minh Toàn, Đà Nẵng'),
(2, 'uploads/services/dn_hotel02.jpg', 'Phòng nghỉ khách sạn Minh Toàn'),
(4, 'uploads/services/dn_car01.jpg', 'Xe du lịch 16 chỗ Đà Nẵng - Hội An'),
(5, 'uploads/services/dn_restaurant01.jpg', 'Nhà hàng biển Mỹ Khê'),

-- Tour 3: TP.HCM – Cần Thơ (service_id 7-9)
(1, 'uploads/services/hcm_hotel01.jpg', 'Khách sạn Rex, TP.HCM'),
(4, 'uploads/services/hcm_car01.jpg', 'Xe limousine 9 chỗ TP.HCM – Cần Thơ'),
(6, 'uploads/services/hcm_restaurant01.jpg', 'Nhà hàng miền Tây'),

-- Tour 4: Vịnh Hạ Long (service_id 10-12)
(14, 'uploads/services/hl_cruise01.jpg', 'Du thuyền Hạ Long'),
(3, 'uploads/services/hl_car01.jpg', 'Xe đưa đón từ bến tàu Hạ Long'),
(6, 'uploads/services/hl_restaurant01.jpg', 'Bữa ăn trên du thuyền'),

-- Tour 5: Đà Lạt (service_id 13-15)
(2, 'uploads/services/dl_hotel01.jpg', 'Khách sạn Dalat Palace'),
(4, 'uploads/services/dl_car01.jpg', 'Xe du lịch 16 chỗ Đà Lạt'),
(6, 'uploads/services/dl_restaurant01.jpg', 'Nhà hàng đặc sản Đà Lạt'),

-- Thêm ảnh bổ sung để đủ 20 ảnh
(6, 'uploads/services/hn_restaurant02.jpg', 'Bữa tối tại nhà hàng Sen Hồ Tây'),
(6, 'uploads/services/dn_restaurant02.jpg', 'Bữa tối tại nhà hàng biển Mỹ Khê'),
(5, 'uploads/services/hcm_restaurant02.jpg', 'Bữa trưa đặc sản miền Tây'),
(5, 'uploads/services/hl_restaurant02.jpg', 'Bữa trưa trên du thuyền Hạ Long'),
(5, 'uploads/services/dl_restaurant02.jpg', 'Bữa sáng tại nhà hàng Dalat');

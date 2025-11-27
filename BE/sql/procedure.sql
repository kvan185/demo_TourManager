DELIMITER $$

-- Procedure đăng ký user mới với role customer
CREATE PROCEDURE proc_register_user
(
    IN p_full_name VARCHAR(200),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_role_id BIGINT;
    DECLARE v_user_id BIGINT;

    -- Lấy role customer
    SELECT id INTO v_role_id FROM roles WHERE name = 'customer';

    -- Kiểm tra email tồn tại
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already exists';
    END IF;

    -- Tạo user
    INSERT INTO users(email, password_hash, role_id)
    VALUES (p_email, SHA2(p_password,256), v_role_id);

    SET v_user_id = LAST_INSERT_ID();

    -- Tạo customer profile
    INSERT INTO customers(user_id, full_name)
    VALUES (v_user_id, p_full_name);
END$$

-- Procedure tạo user mới bởi admin với role customer và thông tin chi tiết
CREATE PROCEDURE admin_add_customer(
    IN p_full_name VARCHAR(200),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(30),
    IN p_gender ENUM('male','female','other'),
    IN p_birthday DATE,
    IN p_address TEXT,
    IN p_note TEXT
)
BEGIN
    DECLARE v_role_id BIGINT;
    DECLARE v_user_id BIGINT;
    DECLARE v_password_hash VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Tìm role_id của customer
    SELECT id INTO v_role_id FROM roles WHERE name = 'customer';
    
    IF v_role_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer role not found';
    END IF;

    -- Tạo password từ ngày sinh (định dạng YYYYMMDD)
    SET v_password_hash = MD5(DATE_FORMAT(p_birthday, '%d%m%Y'));

    START TRANSACTION;

    -- Thêm vào bảng users
    INSERT INTO users (role_id, email, password_hash, created_at, updated_at)
    VALUES (v_role_id, p_email, v_password_hash, NOW(), NOW());
    
    SET v_user_id = LAST_INSERT_ID();

    -- Thêm vào bảng customers
    INSERT INTO customers (user_id, full_name, phone, birthday, gender, address, note, created_at, updated_at)
    VALUES (v_user_id, p_full_name, p_phone, p_birthday, p_gender, p_address, p_note, NOW(), NOW());
END 

-- Procedure tạo employee mới bởi admin với role tùy chọn
CREATE PROCEDURE proc_admin_create_employee
(
    IN p_full_name VARCHAR(200),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(30),
    IN p_birthday DATE,
    IN p_role_id BIGINT
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_password_hash VARCHAR(255);

    -- Kiểm tra role có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM roles WHERE id = p_role_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid role_id';
    END IF;

    -- Kiểm tra email trùng
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already exists';
    END IF;

    -- Tạo password mặc định từ ngày sinh (định dạng DDMMYYYY)
    SET v_password_hash = MD5(DATE_FORMAT(p_birthday, '%d%m%Y'));

    -- Tạo user
    INSERT INTO users(email, password_hash, role_id)
    VALUES (p_email, SHA2(p_password,256), p_role_id);

    SET v_user_id = LAST_INSERT_ID();

    -- Tạo employee profile
    INSERT INTO employees(user_id, full_name, phone)
    VALUES (v_user_id, p_full_name, p_phone);
END$$

-- Procedure đăng nhập
CREATE PROCEDURE proc_login
(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_role_id BIGINT;
    DECLARE v_hash VARCHAR(255);

    -- Lấy hash trong DB
    SELECT id, role_id, password_hash 
    INTO v_user_id, v_role_id, v_hash
    FROM users
    WHERE email = p_email;

    -- Không tìm thấy email
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email does not exist';
    END IF;

    -- So sánh password
    IF v_hash <> SHA2(p_password,256) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect password';
    END IF;

END$$

-- Procedure đổi mật khẩu
CREATE PROCEDURE proc_change_password
(
    IN p_user_id BIGINT,
    IN p_old_password VARCHAR(255),
    IN p_new_password VARCHAR(255)
)
BEGIN
    DECLARE v_old_hash VARCHAR(255);

    -- Lấy hash từ DB
    SELECT password_hash INTO v_old_hash
    FROM users
    WHERE id = p_user_id;

    -- User không tồn tại
    IF v_old_hash IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not exist';
    END IF;

    -- Kiểm tra mật khẩu cũ
    IF v_old_hash <> SHA2(p_old_password,256) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Old password incorrect';
    END IF;

    -- Cập nhật mật khẩu mới
    UPDATE users
    SET password_hash = SHA2(p_new_password,256)
    WHERE id = p_user_id;

END$$

-- Procedure reset mật khẩu bởi admin
CREATE PROCEDURE proc_admin_reset_password
(
    IN p_user_id BIGINT,
    IN p_new_password VARCHAR(255)
)
BEGIN
    -- Kiểm tra user tồn tại
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not exist';
    END IF;

    UPDATE users
    SET password_hash = SHA2(p_new_password,256)
    WHERE id = p_user_id;

END$$

-- Procedure cập nhật thông tin khách hàng
CREATE PROCEDURE update_customer_info(
    IN p_customer_id BIGINT,
    IN p_full_name VARCHAR(200),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(30),
    IN p_gender ENUM('male','female','other'),
    IN p_birthday DATE,
    IN p_address TEXT,
    IN p_note TEXT
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_current_email VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Lấy user_id và email hiện tại của khách hàng
    SELECT user_id, email INTO v_user_id, v_current_email 
    FROM customers 
    WHERE id = p_customer_id;

    -- Kiểm tra nếu khách hàng tồn tại
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found';
    END IF;

    -- Kiểm tra nếu email mới đã tồn tại trong bảng users (ngoại trừ chính user này)
    START TRANSACTION;

    -- Cập nhật bảng users nếu email thay đổi
    IF p_email IS NOT NULL AND p_email != v_current_email THEN
        UPDATE users 
        SET email = p_email, updated_at = NOW()
        WHERE id = v_user_id;
    END IF;

    -- Cập nhật bảng customers
    UPDATE customers 
    SET 
        full_name = COALESCE(p_full_name, full_name),
        phone = COALESCE(p_phone, phone),
        gender = COALESCE(p_gender, gender),
        birthday = COALESCE(p_birthday, birthday),
        address = COALESCE(p_address, address),
        note = COALESCE(p_note, note),
        updated_at = NOW()
    WHERE id = p_customer_id;
END$$

-- Procedure cập nhật thông tin nhân viên
CREATE PROCEDURE update_employee_info
(
    IN p_employee_id BIGINT,
    IN p_full_name VARCHAR(200),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(30),
    IN p_status ENUM('active','inactive','on_leave'),
    IN p_role_id BIGINT,
    IN p_birthday DATE
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_current_email VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Lấy user_id và email hiện tại của nhân viên
    SELECT e.user_id, u.email INTO v_user_id, v_current_email 
    FROM employees e
    JOIN users u ON e.user_id = u.id
    WHERE e.id = p_employee_id;

    -- Kiểm tra nếu nhân viên tồn tại
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Employee not found';
    END IF;

    -- Kiểm tra role_id nếu được cung cấp
    IF p_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM roles WHERE id = p_role_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid role_id';
    END IF;

    -- Kiểm tra nếu email mới đã tồn tại trong bảng users (ngoại trừ chính user này)
    START TRANSACTION;

    -- Cập nhật bảng users nếu email thay đổi
    IF p_email IS NOT NULL AND p_email != v_current_email THEN
        -- Kiểm tra trùng email
        IF EXISTS (SELECT 1 FROM users WHERE email = p_email AND id != v_user_id) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists';
        END IF;

        UPDATE users 
        SET email = p_email, updated_at = NOW(), role_id = COALESCE(p_role_id, role_id),
        WHERE id = v_user_id;
    ELSE
        -- Cập nhật role_id nếu email không thay đổi
        IF p_role_id IS NOT NULL THEN
            UPDATE users 
            SET role_id = p_role_id, updated_at = NOW()
            WHERE id = v_user_id;
        END IF;
    END IF;

    -- Cập nhật bảng employees
    UPDATE employees 
    SET 
        full_name = COALESCE(p_full_name, full_name),
        phone = COALESCE(p_phone, phone),
        birthday = COALESCE(p_birthday, birthday),
        status = COALESCE(p_status, status),
        updated_at = NOW()
    WHERE id = p_employee_id;
END$$

-- Procedure thêm địa điểm mới
CREATE PROCEDURE proc_add_location
(
    IN p_name VARCHAR(200),
    IN p_country VARCHAR(100),
    IN p_region VARCHAR(100),
    IN p_description TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Kiểm tra tên địa điểm đã tồn tại
    IF EXISTS (SELECT 1 FROM locations WHERE name = p_name) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Location name already exists';
    END IF;

    -- Thêm địa điểm mới
    INSERT INTO locations(name, country, region, description)
    VALUES (p_name, p_country, p_region, p_description);
END$$

-- Cập nhật địa điểm
CREATE PROCEDURE proc_update_location
(
    IN p_location_id BIGINT,
    IN p_name VARCHAR(200),
    IN p_country VARCHAR(100),
    IN p_region VARCHAR(100),
    IN p_description TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Kiểm tra tên địa điểm đã tồn tại (ngoại trừ chính địa điểm này)
    IF p_name IS NOT NULL AND EXISTS (SELECT 1 FROM locations WHERE name = p_name AND id != p_location_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Location name already exists';
    END IF;

    -- Kiểm tra trùng tên địa điểm
    IF EXISTS (
        SELECT 1 FROM locations 
        WHERE name = COALESCE(p_name, name)
        AND country = COALESCE(p_country, country)
        AND region = COALESCE(p_region, region)
        AND id != p_location_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Another location already exists with same name, country and region';
    END IF;

    -- Cập nhật địa điểm
    UPDATE locations
    SET 
        name = COALESCE(p_name, name),
        country = COALESCE(p_country, country),
        region = COALESCE(p_region, region),
        description = COALESCE(p_description, description)
    WHERE id = p_location_id;
END$$

-- Thêm dịch vụ mới
CREATE PROCEDURE proc_add_service
(
    IN p_type ENUM('hotel','flight', 'bus', 'car','restaurant','ticket','other'),
    IN p_name VARCHAR(255),
    IN p_provider VARCHAR(255),
    IN p_details TEXT,
    IN p_price DECIMAL(12,2),
    IN p_img_urls TEXT,  -- Danh sách URL ảnh, phân cách bằng dấu phẩy
    IN p_alt_texts TEXT   -- Danh sách alt text tương ứng, phân cách bằng dấu phẩy
)
BEGIN
    DECLARE v_service_id BIGINT;
    DECLARE v_img_url VARCHAR(255);
    DECLARE v_alt_text VARCHAR(255);
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_comma_pos INT;
    DECLARE v_index INT DEFAULT 1;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- 
    START TRANSACTION;

    -- Thêm dịch vụ mới
    INSERT INTO services(type, name, provider, details, price)
    VALUES (p_type, p_name, p_provider, p_details, p_price);

    -- Lấy service_id vừa tạo
    SET v_service_id = LAST_INSERT_ID();

    -- Thêm ảnh nếu có
    IF p_img_urls IS NOT NULL AND TRIM(p_img_urls) != '' THEN
        -- Tính số lượng ảnh
        SET v_img_count = (LENGTH(p_img_urls) - LENGTH(REPLACE(p_img_urls, ',', '')) + 1);
        
        -- Duyệt qua từng ảnh và thêm vào bảng service_images
        WHILE v_counter <= v_img_count DO
            -- Tách URL ảnh
            SET v_current_img_url = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_img_urls, ',', v_counter), ',', -1));
            
            -- Tách alt text tương ứng (nếu có)
            IF p_alt_texts IS NOT NULL AND TRIM(p_alt_texts) != '' THEN
                SET v_current_alt_text = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_alt_texts, ',', v_counter), ',', -1));
            ELSE
                SET v_current_alt_text = NULL;
            END IF;
            
            -- Thêm ảnh vào bảng service_images
            IF v_current_img_url != '' THEN
                INSERT INTO service_images (service_id, img_url, alt_text)
                VALUES (v_service_id, v_current_img_url, v_current_alt_text);
            END IF;
            
            SET v_counter = v_counter + 1;
        END WHILE;
    END IF;
END$$

-- Cập nhật dịch vụ
CREATE PROCEDURE proc_update_service
(
    IN p_service_id BIGINT,
    IN p_type ENUM('hotel','flight', 'bus', 'car','restaurant','ticket','other'),
    IN p_name VARCHAR(255),
    IN p_provider VARCHAR(255),
    IN p_details TEXT,
    IN p_price DECIMAL(12,2),
    IN p_img_urls TEXT,  -- Danh sách URL ảnh mới, phân cách bằng dấu phẩy
    IN p_alt_texts TEXT   -- Danh sách alt text tương ứng, phân cách bằng dấu phẩy
)
BEGIN
    DECLARE v_img_url VARCHAR(255);
    DECLARE v_alt_text VARCHAR(255);
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_comma_pos INT;
    DECLARE v_index INT DEFAULT 1;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Kiểm tra dịch vụ tồn tại
    IF NOT EXISTS (SELECT 1 FROM services WHERE id = p_service_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Service does not exist';
    END IF;

    -- Cập nhật thông tin dịch vụ
    UPDATE services
    SET 
        type = COALESCE(p_type, type),
        name = COALESCE(p_name, name),
        provider = COALESCE(p_provider, provider),
        details = COALESCE(p_details, details),
        price = COALESCE(p_price, price)
    WHERE id = p_service_id;

    -- Cập nhật ảnh nếu có
    IF p_img_urls IS NOT NULL THEN
        -- Xoá ảnh cũ
        DELETE FROM service_images WHERE service_id = p_service_id;

        -- Thêm ảnh mới nếu có
        IF TRIM(p_img_urls) != '' THEN
            SET v_img_count = (LENGTH(p_img_urls) - LENGTH(REPLACE(p_img_urls, ',', '')) + 1);
            SET v_counter = 1;
            
            -- Duyệt qua từng ảnh và thêm vào bảng service_images
            WHILE v_counter <= v_img_count DO
                SET v_current_img_url = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_img_urls, ',', v_counter), ',', -1));
                
                -- Tách alt text tương ứng (nếu có)
                IF p_alt_texts IS NOT NULL AND TRIM(p_alt_texts) != '' THEN
                    SET v_current_alt_text = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_alt_texts, ',', v_counter), ',', -1));
                ELSE
                    SET v_current_alt_text = NULL;
                END IF;

                -- Thêm ảnh vào bảng service_images
                IF v_current_img_url != '' THEN
                    INSERT INTO service_images (service_id, img_url, alt_text)
                    VALUES (p_service_id, v_current_img_url, v_current_alt_text);
                END IF;

                -- Dich chuyển đến ảnh tiếp theo
                SET v_counter = v_counter + 1;
            END WHILE;
        END IF;
    END IF;
END$$

-- Thêm tour mới
CREATE PROCEDURE proc_add_tour
(
    IN p_code VARCHAR(50),
    IN p_title VARCHAR(255),
    IN p_short_description TEXT,
    IN p_price DECIMAL(12,2),
    IN p_duration_days INT,
    IN p_min_participants INT,
    IN p_max_participants INT,
    IN p_main_location_id INT,
    IN p_status ENUM('draft','published','archived'),
    IN p_img_urls TEXT,  -- Danh sách URL ảnh, phân cách bằng dấu phẩy
    IN p_alt_texts TEXT   -- Danh sách alt text tương ứng, phân cách bằng dấu phẩy
)
BEGIN
    DECLARE v_tour_id BIGINT;
    DECLARE v_img_url VARCHAR(255);
    DECLARE v_alt_text VARCHAR(255);
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_comma_pos INT;
    DECLARE v_index INT DEFAULT 1;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Kiểm tra dữ liệu đầu vào
    IF p_min_participants < 1 OR p_max_participants < p_min_participants THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid participant numbers';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM locations WHERE id = p_main_location_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Main location does not exist';
    END IF;
    IF EXISTS (SELECT 1 FROM tours WHERE code = p_code) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tour code already exists';
    END IF;
    

    -- Thêm tour mới
    INSERT INTO tours(code, title, short_description, price, duration_days, min_participants, max_participants, main_location_id, status)
    VALUES (p_code, p_title, p_short_description, p_price, p_duration_days, p_min_participants, p_max_participants, p_main_location_id, p_status);

    -- Lấy tour_id vừa tạo
    SET v_tour_id = LAST_INSERT_ID();

    -- Thêm ảnh nếu có
    IF p_img_urls IS NOT NULL AND TRIM(p_img_urls) != '' THEN
        SET v_img_count = (LENGTH(p_img_urls) - LENGTH(REPLACE(p_img_urls, ',', '')) + 1);
        SET v_counter = 1;

        -- Duyệt qua từng ảnh và thêm vào bảng tour_images
        WHILE v_counter <= v_img_count DO
            SET v_current_img_url = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_img_urls, ',', v_counter), ',', -1));

            -- Tách alt text tương ứng (nếu có)
            IF p_alt_texts IS NOT NULL AND TRIM(p_alt_texts) != '' THEN
                SET v_current_alt_text = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_alt_texts, ',', v_counter), ',', -1));
            ELSE
                SET v_current_alt_text = NULL;
            END IF;

            -- Thêm ảnh vào bảng tour_images
            IF v_current_img_url != '' THEN
                INSERT INTO tour_images (tour_id, img_url, alt_text)
                VALUES (v_tour_id, v_current_img_url, v_current_alt_text);
            END IF;

            SET v_counter = v_counter + 1;
        END WHILE;
    END IF;
END$$

DELIMITER ;
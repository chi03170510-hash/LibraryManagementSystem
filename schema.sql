-- Library Management System schema + seed data
CREATE DATABASE IF NOT EXISTS libraryDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE libraryDB;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS fine;
DROP TABLE IF EXISTS transaction_detail;
DROP TABLE IF EXISTS borrow_transaction;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS publisher;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255),
    user_name VARCHAR(100) NOT NULL,
    password VARCHAR(200) NOT NULL,
    role ENUM('ADMIN','STAFF','READER'),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(250),
    status ENUM('ACTIVE','INACTIVE'),
    UNIQUE KEY uk_users_username (user_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE author (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    biography TEXT,
    birth_date DATETIME,
    email VARCHAR(255),
    UNIQUE KEY uk_author_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE publisher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(300),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    founded_year INT,
    description VARCHAR(255),
    UNIQUE KEY uk_publisher_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author_id INT,
    category_id INT,
    publisher_id INT,
    quantity INT,
    pdf_Url VARCHAR(255),
    coverPhoto_Url VARCHAR(255),
    publish_year INT,
    status ENUM('AVAILABLE','UNAVAILABLE'),
    KEY idx_book_author (author_id),
    KEY idx_book_category (category_id),
    KEY idx_book_publisher (publisher_id),
    CONSTRAINT fk_book_author FOREIGN KEY (author_id) REFERENCES author(id),
    CONSTRAINT fk_book_category FOREIGN KEY (category_id) REFERENCES category(id),
    CONSTRAINT fk_book_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE borrow_transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reader_id INT NOT NULL,
    staff_id INT NOT NULL,
    borrow_date DATETIME NOT NULL,
    due_date DATETIME NOT NULL,
    return_date DATETIME,
    fine_amount DECIMAL(10,2),
    note VARCHAR(255),
    status ENUM('BORROWED','RETURNED','LATE'),
    KEY idx_borrow_reader (reader_id),
    KEY idx_borrow_staff (staff_id),
    CONSTRAINT fk_borrow_reader FOREIGN KEY (reader_id) REFERENCES users(id),
    CONSTRAINT fk_borrow_staff FOREIGN KEY (staff_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transaction_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT,
    book_id INT,
    condition_note VARCHAR(255),
    status ENUM('BORROWED','RETURNED','DAMAGED','LOST','LATE'),
    KEY idx_td_transaction (transaction_id),
    KEY idx_td_book (book_id),
    CONSTRAINT fk_td_transaction FOREIGN KEY (transaction_id) REFERENCES borrow_transaction(id),
    CONSTRAINT fk_td_book FOREIGN KEY (book_id) REFERENCES book(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE fine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT,
    amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    issued_date DATETIME,
    paid_status ENUM('UNPAID','PAID'),
    paid_date DATETIME,
    KEY idx_fine_transaction (transaction_id),
    CONSTRAINT fk_fine_transaction FOREIGN KEY (transaction_id) REFERENCES borrow_transaction(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    KEY idx_feedback_user (user_id),
    KEY idx_feedback_book (book_id),
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_feedback_book FOREIGN KEY (book_id) REFERENCES book(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    recipient_id INT,
    title VARCHAR(255),
    body TEXT,
    status ENUM('READ','UNREAD'),
    type ENUM('SYSTEM','MESSAGE'),
    sent_at DATETIME,
    KEY idx_notif_sender (sender_id),
    KEY idx_notif_recipient (recipient_id),
    CONSTRAINT fk_notif_sender FOREIGN KEY (sender_id) REFERENCES users(id),
    CONSTRAINT fk_notif_recipient FOREIGN KEY (recipient_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO category (id, name, description) VALUES
(1, 'Văn học – Tiểu thuyết', 'Câu chuyện hư cấu phản ánh đời sống, cảm xúc và con người.'),
(2, 'Phát triển bản thân', 'Giúp hoàn thiện tư duy, kỹ năng và thói quen sống tích cực.'),
(3, 'Tâm lý học – Hành vi', 'Giải thích cách con người suy nghĩ, cảm nhận và hành động.'),
(4, 'Kinh tế – Tài chính', 'Phân tích quy luật thị trường, tiền tệ và quản lý tài sản.'),
(5, 'Lịch sử – Chính trị', 'Ghi lại quá khứ, tư tưởng và vận động của các quốc gia, xã hội.'),
(6, 'Khoa học – Công nghệ', 'Giới thiệu khám phá, phát minh và nguyên lý khoa học hiện đại.'),
(7, 'Triết học – Tư tưởng', 'Tư duy về ý nghĩa, đạo đức và bản chất của thế giới, con người.'),
(8, 'Văn hóa – Xã hội', 'Phản ánh phong tục, lối sống, giá trị và thay đổi xã hội.'),
(9, 'Giả tưởng – Phiêu lưu', 'Tạo dựng thế giới tưởng tượng, khám phá và hành trình phiêu lưu.'),
(10,'Kỹ năng – Nghề nghiệp', 'Hướng dẫn kỹ năng làm việc, giao tiếp, lãnh đạo và quản lý.')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

COMMIT;

SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO author (id, birth_date, biography, email, name, nickname) VALUES
(1, STR_TO_DATE('1917-10-29','%Y-%m-%d'),
 'Nam Cao là một nhà văn hiện thực lớn của văn học Việt Nam, hoạt động trong giai đoạn trước và sau Cách mạng tháng 8. Ông viết nhiều truyện ngắn và tiểu thuyết mang đề tài người nông dân, trí thức thấp, đời sống nghèo khổ, đấu tranh, khắc họa sâu sắc số phận con người.',
 NULL,
 'Trần Hữu Tri',
 'Nam Cao; ngoài ra có các bút danh khác: Thúy Rư, Xuân Du, Nguyệt, Nhiêu Khê'),
(2, STR_TO_DATE('1818-05-05','%Y-%m-%d'),
 'Nhà triết học (Karl Heinrich Marx), nhà tư tưởng xã hội(Friedrich Engels), lãnh tụ cách mạng Nga (Lenin)',
 NULL,
 'Karl Heinrich Marx, Friedrich Engels, và Vladimir Ilyanov',
 'Moor - Karl Heinrich Marx, The General - Friedrich Engels, Lenin - Vladimir Ilyich Ulyanov'),
(3, STR_TO_DATE('1856-05-06','%Y-%m-%d'),
 'Freud là bác sĩ thần kinh người Áo, người sáng lập ngành phân tâm học (psychoanalysis)',
 NULL,
 'Sigismund Schlomo Freud',
 NULL),
(4, STR_TO_DATE('1955-05-07','%Y-%m-%d'),
 'Nguyễn Nhật Ánh sinh ngày 7 tháng 5 năm 1955 tại tỉnh Quảng Nam. Ông được coi là một trong những nhà văn thành công nhất viết sách cho tuổi thơ, tuổi mới lớn với hơn 100 tác phẩm các thể loại.',
 'NguyenNhatAnh@gmail.com',
 'Nguyễn Nhật Ánh',
 'Nguyễn Nhật Ánh'),
(5, STR_TO_DATE('1974-04-08','%Y-%m-%d'),
 'Adam Khoo Yean Ann (sinh ngày 8 tháng 4 năm 1974 tại Singapore) là một doanh nhân, tác giả nổi tiếng, và chuyên gia đào tạo hàng đầu Châu Á.',
 'thoon@labyrinthap.com',
 'Adam Khoo',
 'Adam Khoo'),
(6, STR_TO_DATE('1890-05-19','%Y-%m-%d'),
 'Hồ Chí Minh (1890-1969) là một nhà cách mạng và chính khách Việt Nam, tên khai sinh là Nguyễn Sinh Cung. Ông là người sáng lập Đảng Cộng sản Việt Nam',
 NULL,
 'Nguyễn Sinh Cung',
 'Hồ Chí Minh, Nguyễn Ái Quốc, Nguyễn Tất Thành'),
(7, STR_TO_DATE('1982-01-23','%Y-%m-%d'),
 'Cal Newport là tác giả, giáo sư khoa học máy tính tại Đại học Georgetown, nổi tiếng với các sách về năng suất và làm việc sâu.',
 NULL,
 'Cal Newport',
 NULL),
(8, STR_TO_DATE('1564-04-26','%Y-%m-%d'),
 'William Shakespeare là nhà viết kịch, nhà thơ và diễn viên người Anh, được xem là nhà văn vĩ đại nhất trong nền văn học Anh.',
 NULL,
 'William Shakespeare',
 'Bard of Avon'),
(9, STR_TO_DATE('1947-08-24','%Y-%m-%d'),
 'Paulo Coelho là tiểu thuyết gia người Brazil, nổi tiếng với các tác phẩm mang tính triết lý và truyền cảm hứng như "Nhà giả kim".',
 NULL,
 'Paulo Coelho',
 NULL)
ON DUPLICATE KEY UPDATE name = VALUES(name), nickname = VALUES(nickname), biography = VALUES(biography), birth_date = VALUES(birth_date), email = VALUES(email);

COMMIT;

START TRANSACTION;

INSERT INTO publisher (id, name, email, address)
VALUES (1, 'Default Publisher', NULL, NULL)
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), address = VALUES(address);

INSERT INTO book
(author_id, category_id, publish_year, publisher_id, quantity, title, status, coverPhoto_Url, pdf_Url) VALUES
(1,1,1941,1,36,'Tập truyện ngắn Chí Phèo','AVAILABLE','https://drive.google.com/file/d/191AGQ8N8ZTnd-SQxA09LcHMFOaNuE81o/view?usp=drive_link','https://drive.google.com/file/d/1ROYT1Cc-keYqDVw_9V-EQC7dnwVyWuam/view?usp=drive_link'),
(1,1,1943,1,18,'Tập truyện ngắn Lão Hạc','AVAILABLE','https://drive.google.com/file/d/1UhwAknyxgXCY7gAEwDovZo_dylC74Fiq/view?usp=drive_link','https://drive.google.com/file/d/1VtDz9Mqui2SdN6IZPjIYG5pH33C_W0Ba/view?usp=drive_link'),
(1,1,1948,1,25,'Tập truyện ngắn Đôi mắt','AVAILABLE','https://drive.google.com/file/d/18KzWejuFLjuviWP8TeakTHKE2F2m6_fT/view?usp=drive_link','https://drive.google.com/file/d/1CtLnXgCvxOBH4yYGLxYeoA81vkI5QJXC/view?usp=drive_link'),
(2,7,1845,1,22,'Giáo trình Triết học Mác – Lênin','AVAILABLE','https://drive.google.com/file/d/1x6g7cSOdHR_2af9Eru5Zx6R1ka47KVsA/view?usp=drive_link','https://drive.google.com/file/d/1jnR2MTKG0YriLt-N9rMm-onPjw8UK4au/view?usp=drive_link'),
(2,7,1867,1,34,'Giáo trình Kinh tế chính trị Mác – Lênin','AVAILABLE','https://drive.google.com/file/d/1KUdHtPfpDekgwySHONXtWkv6A38CoFHb/view?usp=drive_link','https://drive.google.com/file/d/1etCuUcdlK9mjtLf_YGDsdG76gk4ZmZ2m/view?usp=drive_link'),
(2,7,1848,1,41,'Giáo trình Chủ nghĩa xã hội khoa học','AVAILABLE','https://drive.google.com/file/d/1MaEDfZHywjgDM5MqipkL8Nw4MGRneD8Z/view?usp=drive_link','https://drive.google.com/file/d/1lnxPm_VqbC8DJYGo8YQaNxdYNcE92quF/view?usp=drive_link'),
(3,3,1900,1,38,'The Interpretation of Dreams','AVAILABLE','https://drive.google.com/file/d/1bNDHhIwFMWXeP6dU5DAYEICPPF7gWpBn/view?usp=drive_link','https://drive.google.com/file/d/11lSFu2UjDDujds57q7w2yPZ5yG0Umovt/view?usp=drive_link'),
(3,3,1901,1,19,'The Psychopathology of Everyday Life','AVAILABLE','https://drive.google.com/file/d/1IkBiyvxvfM_hh2AuUW00Oh7csfHw0ekA/view?usp=drive_link','https://drive.google.com/file/d/1zegRzjwcnF6eXg1eGDjGd_wi6up9oQUS/view?usp=drive_link'),
(3,3,1923,1,55,'The Ego and the Id','AVAILABLE','https://drive.google.com/file/d/1cdUh0HpM8iTU2W4jGlrWs8BBa0UCxFbT/view?usp=drive_link','https://drive.google.com/file/d/1n7KBKU_iFjiqoE9kqRJZfY58Zz7_OQMh/view?usp=drive_link'),
(4,1,2008,1,12,'Cho tôi xin một vé đi tuổi thơ','AVAILABLE','https://drive.google.com/file/d/1HRGTIryc56lWQtsPql86xa7QrNkNBwrg/view?usp=drive_link','https://drive.google.com/file/d/1Hp26td_pOg1Mlox99S2qRbpjWZfbQQE9/view?usp=drive_link'),
(4,1,2010,1,20,'Tôi thấy hoa vàng trên cỏ xanh','AVAILABLE','https://drive.google.com/file/d/1VsGmyHjSqxVu4wrk2NJyWVgEFlNwx_fb/view?usp=drive_link','https://drive.google.com/file/d/1UGuvQ23E793Q9-174eOBZoWbEGxtmekP/view?usp=drive_link'),
(4,1,1990,1,18,'Mắt biếc','AVAILABLE','https://drive.google.com/file/d/1J_nlBKf4UcbH4h3tBWP2pVUcIFmdkruI/view?usp=drive_link','https://drive.google.com/file/d/1RsGy-Scpa4dzWi-GrAnzA5lJ0N3gOz4v/view?usp=drive_link'),
(5,2,1998,1,35,'Tôi tài giỏi, bạn cũng thế!','AVAILABLE','https://drive.google.com/file/d/1sfZ_iPt2h_x4kmHFmJCYG8ZdJH8pof5Z/view?usp=drive_link','https://drive.google.com/file/d/1PYhfSSpZARj9Uh2H81-UCqq3jHHbO4rC/view?usp=drive_link'),
(5,10,2008,1,14,'Bí quyết xây dựng cơ nghiệp bạc tỷ','AVAILABLE','https://drive.google.com/file/d/1bmHnwc2DFbbU1XvwKNlVKAccJntaaIAZ/view?usp=drive_link','https://drive.google.com/file/d/1HPysBjgjii4ZjAAw_1HKrMAa7fuEa-FG/view?usp=drive_link'),
(5,2,2004,1,28,'Làm chủ tư duy thay đổi vận mệnh','AVAILABLE','https://drive.google.com/file/d/1-NEBgEzk0uhVlaEURQI0nGpUzRi7KrVJ/view?usp=drive_link','https://drive.google.com/file/d/1epzg3ImLqcy2uPTdUHRM6VmxwNVvXKJf/view?usp=drive_link'),
(6,5,1942,1,22,'Lịch sử nước ta','AVAILABLE','https://drive.google.com/file/d/1upWwKNZq51OTBhAXeeL0iPJRLdv-FyG_/view?usp=drive_link','https://drive.google.com/file/d/1Vt3CoVypZgaSSuQtzxbZJ4JH7-f3y_Ot/view?usp=drive_link'),
(6,5,1943,1,15,'Nhật kí trong tù','AVAILABLE','https://drive.google.com/file/d/1zeLUpD1AWxj6Hnj4KEBFBTHBb2RBFhUN/view?usp=drive_link','https://drive.google.com/file/d/1L7fqKgG2fR-wo97tkeD_Tb0vqrSfczPD/view?usp=drive_link'),
(6,5,1946,1,21,'Bản án chế độ thực dân Pháp','AVAILABLE','https://drive.google.com/file/d/1M5esJGaa7VUMSXf30op5LZ8haCgQEXOH/view?usp=drive_link','https://drive.google.com/file/d/1HcEL5eh56Jsf8G7fh-8Vjpiz3LGgjNG5/view?usp=drive_link'),
(7,6,2012,1,12,'Kỹ năng đi trước đam mê','AVAILABLE','https://drive.google.com/file/d/1y10c8QD6pBwlWV2qGTlSQJ5yOZFKx7mt/view?usp=drive_link','https://drive.google.com/file/d/1XlVlc4nNr6c3O8lURaX7mI-7e5RjvFLz/view?usp=drive_link'),
(7,6,2019,1,69,'Lối sống tối giản thời công nghệ số','AVAILABLE','https://drive.google.com/file/d/1f9RzZmdGA-PjXF90KtDJ8sir9CN8FJ4W/view?usp=drive_link','https://drive.google.com/file/d/17KD6tr0IUw9uWqQLq9NC3D19qUJvloby/view?usp=drive_link'),
(7,3,2016,1,36,'Làm ra làm chơi ra chơi','AVAILABLE','https://drive.google.com/file/d/1t4-MqfumPNUJmL4pSDIsaJGxhjPzHJ58/view?usp=drive_link','https://drive.google.com/file/d/1hsBfU_1f8a-HpEWPNU29tX9dlkmtl42c/view?usp=drive_link'),
(8,10,1597,1,30,'Romeo và Juliet','AVAILABLE','https://drive.google.com/file/d/1sLOokxdTQDdfnyCeOadg2gUxE4Bg5Hgz/view?usp=drive_link','https://drive.google.com/file/d/1bPbRdhCC33Mi4O3186Ew8Ya0SgoOnlCR/view?usp=drive_link'),
(8,10,1600,1,24,'HamLet – Hoàng Tử Đan Mạch','AVAILABLE','https://drive.google.com/file/d/1_j72dioypOvmJKT_axU5qd4Si89LouQo/view?usp=drive_link','https://drive.google.com/file/d/1wnTfbA8sRwi0VCbTqiZuG3gAI7uTRIik/view?usp=drive_link'),
(8,10,1610,1,10,'Cơn bão','AVAILABLE','https://drive.google.com/file/d/1E3O_8stDmL19hopCxDtE7xfpi-sLIgbr/view?usp=drive_link','https://drive.google.com/file/d/1Zl1KMN2a2EyMctgv9k-h45fBC0it0yeY/view?usp=drive_link'),
(9,1,1988,1,40,'Nhà giả kim','AVAILABLE','https://drive.google.com/file/d/1kivPuNy_LpyLB-kM9lW9jovGiYrVxWuI/view?usp=drive_link','https://drive.google.com/file/d/15WtFqkx3EsI7TXcwxZB-uQj5_GOpQyRC/view?usp=drive_link'),
(9,10,1998,1,15,'Veronica quyết chết','AVAILABLE','https://drive.google.com/file/d/10LiWyadBpHIIdeLorfRvwOfjNfFdK_17/view?usp=drive_link','https://drive.google.com/file/d/1rlX1liDAa4d_OjtWrBFhbZVdAIdVyO7K/view?usp=drive_link'),
(9,8,1997,1,27,'Cẩm Nang Của Người Chiến Binh Ánh Sáng','AVAILABLE','https://drive.google.com/file/d/17hK01WZBqhhGgPEiTDEiZhaV7cBxRgV1/view?usp=drive_link','https://drive.google.com/file/d/1KaLyOlMRyZl_g1X3To9-rbyBjAffUiq2/view?usp=drive_link');

COMMIT;

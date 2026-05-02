-- KITSW Hostel Allocation System - Updated Schema
CREATE DATABASE IF NOT EXISTS kitsw_hostel;
USE kitsw_hostel;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    mobile      VARCHAR(10)  NOT NULL,
    password    VARCHAR(255) NOT NULL,
    gender      ENUM('Male','Female') NOT NULL,
    roll_number VARCHAR(20)  NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    room_id         INT AUTO_INCREMENT PRIMARY KEY,
    room_number     VARCHAR(10)  NOT NULL UNIQUE,
    floor           ENUM('Ground','1st','2nd') NOT NULL,
    type            ENUM('AC + Attached','Attached + Non AC','Non Attached + Non AC') NOT NULL,
    capacity        INT NOT NULL DEFAULT 4,
    available_slots INT NOT NULL DEFAULT 4,
    hostel_type     ENUM('Male','Female') NOT NULL
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    booking_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    room_id      INT NOT NULL,
    token_number VARCHAR(20)  NOT NULL,
    status       ENUM('Booked','Pending') DEFAULT 'Booked',
    roll_number  VARCHAR(20),
    username     VARCHAR(100),
    booked_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- Upgrade existing table if needed
ALTER TABLE users ADD COLUMN IF NOT EXISTS roll_number VARCHAR(20) UNIQUE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS token_number VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status ENUM('Booked','Pending') DEFAULT 'Booked';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS roll_number VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS username VARCHAR(100);

-- ─── Seed Rooms ───────────────────────────────────────────────────
-- Ground: Non Attached + Non AC (101-105, 116-120)
INSERT IGNORE INTO rooms (room_number,floor,type,capacity,available_slots,hostel_type) VALUES
('101','Ground','Non Attached + Non AC',4,4,'Male'),('102','Ground','Non Attached + Non AC',4,4,'Male'),
('103','Ground','Non Attached + Non AC',4,4,'Male'),('104','Ground','Non Attached + Non AC',4,4,'Male'),
('105','Ground','Non Attached + Non AC',4,4,'Male'),('116','Ground','Non Attached + Non AC',4,4,'Male'),
('117','Ground','Non Attached + Non AC',4,4,'Male'),('118','Ground','Non Attached + Non AC',4,4,'Male'),
('119','Ground','Non Attached + Non AC',4,4,'Male'),('120','Ground','Non Attached + Non AC',4,4,'Male'),
-- Ground: AC + Attached (106-115)
('106','Ground','AC + Attached',4,4,'Male'),('107','Ground','AC + Attached',4,4,'Male'),
('108','Ground','AC + Attached',4,4,'Male'),('109','Ground','AC + Attached',4,4,'Male'),
('110','Ground','AC + Attached',4,4,'Male'),('111','Ground','AC + Attached',4,4,'Male'),
('112','Ground','AC + Attached',4,4,'Male'),('113','Ground','AC + Attached',4,4,'Male'),
('114','Ground','AC + Attached',4,4,'Male'),('115','Ground','AC + Attached',4,4,'Male'),
-- Ground: Attached + Non AC (121-126)
('121','Ground','Attached + Non AC',4,4,'Male'),('122','Ground','Attached + Non AC',4,4,'Male'),
('123','Ground','Attached + Non AC',4,4,'Male'),('124','Ground','Attached + Non AC',4,4,'Male'),
('125','Ground','Attached + Non AC',4,4,'Male'),('126','Ground','Attached + Non AC',4,4,'Male'),
-- 1st: Non Attached + Non AC (201-220)
('201','1st','Non Attached + Non AC',4,4,'Male'),('202','1st','Non Attached + Non AC',4,4,'Male'),
('203','1st','Non Attached + Non AC',4,4,'Male'),('204','1st','Non Attached + Non AC',4,4,'Male'),
('205','1st','Non Attached + Non AC',4,4,'Male'),('206','1st','Non Attached + Non AC',4,4,'Male'),
('207','1st','Non Attached + Non AC',4,4,'Male'),('208','1st','Non Attached + Non AC',4,4,'Male'),
('209','1st','Non Attached + Non AC',4,4,'Male'),('210','1st','Non Attached + Non AC',4,4,'Male'),
('211','1st','Non Attached + Non AC',4,4,'Male'),('212','1st','Non Attached + Non AC',4,4,'Male'),
('213','1st','Non Attached + Non AC',4,4,'Male'),('214','1st','Non Attached + Non AC',4,4,'Male'),
('215','1st','Non Attached + Non AC',4,4,'Male'),('216','1st','Non Attached + Non AC',4,4,'Male'),
('217','1st','Non Attached + Non AC',4,4,'Male'),('218','1st','Non Attached + Non AC',4,4,'Male'),
('219','1st','Non Attached + Non AC',4,4,'Male'),('220','1st','Non Attached + Non AC',4,4,'Male'),
-- 1st: Attached + Non AC (221-245)
('221','1st','Attached + Non AC',4,4,'Male'),('222','1st','Attached + Non AC',4,4,'Male'),
('223','1st','Attached + Non AC',4,4,'Male'),('224','1st','Attached + Non AC',4,4,'Male'),
('225','1st','Attached + Non AC',4,4,'Male'),('226','1st','Attached + Non AC',4,4,'Male'),
('227','1st','Attached + Non AC',4,4,'Male'),('228','1st','Attached + Non AC',4,4,'Male'),
('229','1st','Attached + Non AC',4,4,'Male'),('230','1st','Attached + Non AC',4,4,'Male'),
('231','1st','Attached + Non AC',4,4,'Male'),('232','1st','Attached + Non AC',4,4,'Male'),
('233','1st','Attached + Non AC',4,4,'Male'),('234','1st','Attached + Non AC',4,4,'Male'),
('235','1st','Attached + Non AC',4,4,'Male'),('236','1st','Attached + Non AC',4,4,'Male'),
('237','1st','Attached + Non AC',4,4,'Male'),('238','1st','Attached + Non AC',4,4,'Male'),
('239','1st','Attached + Non AC',4,4,'Male'),('240','1st','Attached + Non AC',4,4,'Male'),
('241','1st','Attached + Non AC',4,4,'Male'),('242','1st','Attached + Non AC',4,4,'Male'),
('243','1st','Attached + Non AC',4,4,'Male'),('244','1st','Attached + Non AC',4,4,'Male'),
('245','1st','Attached + Non AC',4,4,'Male'),
-- 2nd: Non Attached + Non AC (301-320)
('301','2nd','Non Attached + Non AC',4,4,'Male'),('302','2nd','Non Attached + Non AC',4,4,'Male'),
('303','2nd','Non Attached + Non AC',4,4,'Male'),('304','2nd','Non Attached + Non AC',4,4,'Male'),
('305','2nd','Non Attached + Non AC',4,4,'Male'),('306','2nd','Non Attached + Non AC',4,4,'Male'),
('307','2nd','Non Attached + Non AC',4,4,'Male'),('308','2nd','Non Attached + Non AC',4,4,'Male'),
('309','2nd','Non Attached + Non AC',4,4,'Male'),('310','2nd','Non Attached + Non AC',4,4,'Male'),
('311','2nd','Non Attached + Non AC',4,4,'Male'),('312','2nd','Non Attached + Non AC',4,4,'Male'),
('313','2nd','Non Attached + Non AC',4,4,'Male'),('314','2nd','Non Attached + Non AC',4,4,'Male'),
('315','2nd','Non Attached + Non AC',4,4,'Male'),('316','2nd','Non Attached + Non AC',4,4,'Male'),
('317','2nd','Non Attached + Non AC',4,4,'Male'),('318','2nd','Non Attached + Non AC',4,4,'Male'),
('319','2nd','Non Attached + Non AC',4,4,'Male'),('320','2nd','Non Attached + Non AC',4,4,'Male'),
-- 2nd: Attached + Non AC (321-345)
('321','2nd','Attached + Non AC',4,4,'Male'),('322','2nd','Attached + Non AC',4,4,'Male'),
('323','2nd','Attached + Non AC',4,4,'Male'),('324','2nd','Attached + Non AC',4,4,'Male'),
('325','2nd','Attached + Non AC',4,4,'Male'),('326','2nd','Attached + Non AC',4,4,'Male'),
('327','2nd','Attached + Non AC',4,4,'Male'),('328','2nd','Attached + Non AC',4,4,'Male'),
('329','2nd','Attached + Non AC',4,4,'Male'),('330','2nd','Attached + Non AC',4,4,'Male'),
('331','2nd','Attached + Non AC',4,4,'Male'),('332','2nd','Attached + Non AC',4,4,'Male'),
('333','2nd','Attached + Non AC',4,4,'Male'),('334','2nd','Attached + Non AC',4,4,'Male'),
('335','2nd','Attached + Non AC',4,4,'Male'),('336','2nd','Attached + Non AC',4,4,'Male'),
('337','2nd','Attached + Non AC',4,4,'Male'),('338','2nd','Attached + Non AC',4,4,'Male'),
('339','2nd','Attached + Non AC',4,4,'Male'),('340','2nd','Attached + Non AC',4,4,'Male'),
('341','2nd','Attached + Non AC',4,4,'Male'),('342','2nd','Attached + Non AC',4,4,'Male'),
('343','2nd','Attached + Non AC',4,4,'Male'),('344','2nd','Attached + Non AC',4,4,'Male'),
('345','2nd','Attached + Non AC',4,4,'Male');
-- NOTE: Duplicate the above INSERT with hostel_type='Female' for Girls hostel

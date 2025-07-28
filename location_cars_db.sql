-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 28, 2025 at 10:43 AM
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
-- Database: `location_cars_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` int(11) NOT NULL,
  `status` enum('available','unavailable') NOT NULL DEFAULT 'available',
  `img_url` varchar(255) DEFAULT NULL,
  `fuel_type` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `brand`, `model`, `year`, `status`, `img_url`, `fuel_type`, `price`) VALUES
(1, 'BMW', 'Series 1', 2021, 'available', 'https://www.moteur.ma/media/images/models/bmw-serie_1-131066.png', 'Petrol', 452.00),
(2, 'BMW', 'Series 2', 2022, 'available', 'https://www.moteur.ma/media/images/models/bmw-serie_2-667750.png', 'Diesel', 480.00),
(3, 'BMW', 'Series 3', 2023, 'available', 'https://www.moteur.ma/media/images/models/serie-3.png', 'Petrol', 510.00),
(4, 'BMW', 'Series 4', 2023, 'available', 'https://www.moteur.ma/media/images/models/bmw-serie_4-363868.png', 'Hybrid', 550.00),
(5, 'Mercedes', 'Class A', 2022, 'available', 'https://www.moteur.ma/media/images/models/a9.png', 'Petrol', 450.00),
(6, 'Mercedes', 'Class B', 2021, 'available', 'https://www.moteur.ma/media/images/models/mercedes-classe_b-865671.png', 'Diesel', 460.00),
(7, 'Mercedes', 'Class C', 2023, 'available', 'https://www.moteur.ma/media/images/models/mercedes-classe_c-814581.png', 'Petrol', 520.00),
(8, 'Mercedes', 'Class E', 2022, 'available', 'https://www.moteur.ma/media/images/models/mercedes-classe_e-134155.png', 'Hybrid', 650.00),
(9, 'Audi', 'A1', 2023, 'available', 'https://www.moteur.ma/media/images/models/audi-a1-274298.png', 'Petrol', 450.00),
(10, 'Audi', 'A3', 2022, 'available', 'https://www.moteur.ma/media/images/models/audi-a3-662417.png', 'Diesel', 460.00),
(11, 'Audi', 'A4', 2023, 'available', 'https://www.moteur.ma/media/images/models/audi-a4-324290.png', 'Petrol', 480.00),
(12, 'Audi', 'A5', 2021, 'available', 'https://www.moteur.ma/media/images/models/audi-a5-627092.png', 'Hybrid', 500.00),
(13, 'Hyundai', 'I10', 2022, 'available', 'https://www.moteur.ma/media/images/models/hyundai-i10-834553.png', 'Petrol', 450.00),
(14, 'Hyundai', 'I20', 2023, 'available', 'https://www.moteur.ma/media/images/models/hyundai-i20-359425.png', 'Diesel', 460.00),
(15, 'Hyundai', 'Elantra', 2021, 'available', 'https://www.moteur.ma/media/images/models/hyundai-elantra-231573.png', 'Petrol', 470.00),
(16, 'Hyundai', 'Tucson', 2023, 'available', 'https://www.moteur.ma/media/images/models/hyundai-tucson-415934.png', 'Hybrid', 480.00),
(17, 'Volkswagen', 'Polo', 2022, 'available', 'https://www.moteur.ma/media/images/models/polo12.png', 'Petrol', 450.00),
(18, 'Volkswagen', 'Golf', 2023, 'available', 'https://www.moteur.ma/media/images/models/volkswagen-golf_8-244473.png', 'Diesel', 460.00),
(19, 'Volkswagen', 'Tiguan', 2021, 'available', 'https://www.moteur.ma/media/images/models/volkswagen-tiguan-974353.png', 'Petrol', 480.00),
(20, 'Volkswagen', 'Touareg', 2022, 'available', 'https://www.moteur.ma/media/images/models/volkswagen-touareg-369520.png', 'Hybrid', 650.00);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `car_id`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(20, 2, 1, '2025-07-28', '2025-07-31', 'cancelled', '2025-07-28 08:10:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('client','admin') DEFAULT 'client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', 'Admin@ad.min', '$2b$10$G8sLhvLw/bJWZZPGbC7efO1UysdwWsSOmgpPRBpBHIc2yM5Arb2dS', 'admin', '2025-07-28 07:17:12'),
(2, 'karim 1', 'karimggamee@gmail.com', '$2b$10$nxQ2q.1iA0E6L1r4IMCdZ.g1eFUbH/7WeTEiiZA.gHwMG1wF7LiLe', 'client', '2025-07-26 17:00:53'),
(3, 'test', 'test@gmail.com', '$2b$10$tqDnIuTQVkBMS99.wOj8NuroAB8yi6zZL8.9ZNRJC2QlxfEzW3n/y', 'client', '2025-07-27 00:03:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

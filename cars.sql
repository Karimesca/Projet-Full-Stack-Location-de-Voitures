-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2025 at 07:00 PM
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
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `status` enum('available','unavailable') DEFAULT 'available',
  `image_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `fuel_type` enum('Essence','Diesel') DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `seats` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `brand`, `model`, `year`, `status`, `image_url`, `created_at`, `fuel_type`, `price`, `seats`) VALUES
(1, 'Toyota', 'Yaris', 2020, 'available', '#', '2025-07-17 12:58:59', 'Essence', 300.00, 5),
(2, 'Toyota', 'Corolla', 2021, 'available', '#', '2025-07-17 12:58:59', 'Essence', 350.00, 5),
(3, 'Toyota', 'Hilux', 2022, 'available', '#', '2025-07-17 12:58:59', 'Diesel', 550.00, 5),
(4, 'Renault', 'Clio', 2019, 'available', '#', '2025-07-17 12:58:59', 'Essence', 280.00, 5),
(5, 'Renault', 'Duster', 2020, 'available', '#', '2025-07-17 12:58:59', 'Diesel', 400.00, 5),
(6, 'Renault', 'Koleos', 2021, 'available', '#', '2025-07-17 12:58:59', 'Diesel', 500.00, 5),
(7, 'Dacia', 'Sandero', 2021, 'available', '#', '2025-07-17 12:58:59', 'Essence', 250.00, 5),
(8, 'Dacia', 'Duster', 2020, 'available', '#', '2025-07-17 12:58:59', 'Diesel', 400.00, 5),
(9, 'Hyundai', 'Tucson', 2022, 'available', '#', '2025-07-17 12:58:59', 'Essence', 500.00, 5),
(10, 'Hyundai', 'i10', 2021, 'available', '#', '2025-07-17 12:58:59', 'Essence', 270.00, 4),
(12, 'test', 'tste', 2022, '', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', '2025-07-17 16:14:02', 'Diesel', 800.00, 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

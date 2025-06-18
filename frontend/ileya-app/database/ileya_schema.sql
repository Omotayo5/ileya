-- Ileya Database Schema
-- This schema is generated based on the backend application logic.

-- Create and use the database
CREATE DATABASE IF NOT EXISTS ileya_db
DEFAULT CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci';

USE ileya_db;

-- -----------------------------------------------------
-- Table `users`
-- Stores user account information.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NULL,
    profile_picture VARCHAR(255) NULL,
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'inactive', -- e.g., 'active', 'inactive', 'expired'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table `rentals`
-- Stores all rental property listings.
-- This is created in two steps to avoid potential parsing issues.
-- -----------------------------------------------------
-- Step 1: Create the table structure with TEXT instead of JSON for compatibility.
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    rental_price DECIMAL(12, 2) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    bedrooms INT DEFAULT 0,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    features TEXT NULL,         -- Stores a JSON array of features as TEXT
    photos TEXT NULL,           -- Stores a JSON array of photo filenames as TEXT
    contact_role VARCHAR(50) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 2: Add foreign key constraint separately.
ALTER TABLE rentals
ADD CONSTRAINT fk_rentals_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- -----------------------------------------------------
-- Table `subscription_plans`
-- Stores available subscription plans.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `user_subscriptions`
-- Tracks user subscriptions to plans.
-- This is created in two steps to avoid potential parsing issues.
-- -----------------------------------------------------
-- Step 1: Create the table structure.
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 2: Add foreign key constraints separately.
ALTER TABLE user_subscriptions
ADD CONSTRAINT fk_user_subscriptions_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_subscriptions
ADD CONSTRAINT fk_user_subscriptions_plan
FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE RESTRICT;


-- -----------------------------------------------------
-- Table `reviews`
-- Stores user reviews for listers.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lister_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lister_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (lister_id, reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table `lister_reports`
-- Stores user reports (scam/legit) about listers.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS lister_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    lister_id INT NOT NULL,
    report_type ENUM('scam', 'legit') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_report (reporter_id, lister_id),
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lister_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Seed Data
-- Inserts the default subscription plan required by the application.
-- -----------------------------------------------------
INSERT INTO subscription_plans (name, price, duration_days, description)
VALUES ('Unlimited Listings Plan', 500.00, 30, 'Post as many rental properties as you want for 30 days.')
ON DUPLICATE KEY UPDATE
    price = VALUES(price),
    duration_days = VALUES(duration_days),
    description = VALUES(description);


-- -----------------------------------------------------
-- Table `reviews`
-- Stores user reviews for listers.
-- This is created in two steps to avoid potential parsing issues with complex CREATE TABLE statements.
-- -----------------------------------------------------
-- Step 1: Create the table structure.
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lister_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 2: Add foreign key constraints separately.
ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_lister
FOREIGN KEY (lister_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_reviewer
FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE;


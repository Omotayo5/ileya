-- Table for storing available subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking user subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('active', 'inactive', 'cancelled') NOT NULL DEFAULT 'inactive',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Insert the single, default subscription plan
-- This ensures the plan is created if it doesn't exist, and updated if it does.
INSERT INTO subscription_plans (id, name, price, duration_days, description)
VALUES (1, 'Premium Access', 499.99, 30, 'Unlimited property access, browse verified listings, priority renter support, billed monthly.')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    price = VALUES(price),
    duration_days = VALUES(duration_days),
    description = VALUES(description);

-- Add a column to the users table to quickly check subscription status
ALTER TABLE users ADD COLUMN subscription_status ENUM('none', 'active', 'inactive') NOT NULL DEFAULT 'none';

-- Seed inactive subscription rows for all existing users who do not yet have one
INSERT INTO user_subscriptions (user_id, plan_id, status, start_date, end_date)
SELECT u.id, 1, 'inactive', NOW(), NOW()
FROM users u
LEFT JOIN user_subscriptions us ON us.user_id = u.id
WHERE us.id IS NULL;

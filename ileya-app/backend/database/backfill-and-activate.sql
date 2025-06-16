-- Step 1: Create 'inactive' subscriptions for any user who doesn't have one.
-- This ensures every user has a subscription record to begin with.
INSERT INTO user_subscriptions (user_id, plan_id, status, start_date, end_date)
SELECT
    u.id,
    (SELECT id FROM subscription_plans WHERE name = 'Premium Access' LIMIT 1),
    'inactive',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY)
FROM
    users u
LEFT JOIN
    user_subscriptions us ON u.id = us.user_id
WHERE
    us.id IS NULL;

-- Step 2: Activate all 'inactive' subscriptions and sync the main user table.
-- This brings all existing users up to an 'active' status.
UPDATE user_subscriptions SET status = 'active' WHERE status = 'inactive';
UPDATE users SET subscription_status = 'active' WHERE subscription_status = 'inactive';

-- Confirmation message
SELECT 'Subscription backfill and activation complete for all existing users.' AS status;

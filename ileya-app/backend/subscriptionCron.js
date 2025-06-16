const cron = require('node-cron');
const db = require('./db');

// Daily job at midnight to expire finished subscriptions and sync user status
cron.schedule('0 0 * * *', async () => {
  try {
    // 1. Expire subscriptions whose end_date has passed
    await db.query(
      "UPDATE user_subscriptions SET status = 'cancelled' WHERE status = 'active' AND end_date < NOW()"
    );

    // 2. Keep user table in sync (set active if at least one active subscription, else expired)
    await db.query(
      `UPDATE users u
       LEFT JOIN (
         SELECT user_id, MAX(status = 'active') AS has_active
         FROM user_subscriptions
         GROUP BY user_id
       ) us ON u.id = us.user_id
       SET u.subscription_status = CASE WHEN us.has_active = 1 THEN 'active' ELSE 'inactive' END`
    );

    console.log('[Cron] Subscription statuses synchronised');
  } catch (err) {
    console.error('[Cron] Failed to update subscription statuses:', err);
  }
});

module.exports = {};

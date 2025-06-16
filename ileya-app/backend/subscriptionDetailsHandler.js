const db = require('./database/db');

async function getSubscriptionDetails(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'You must be logged in.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
        sp.name AS plan_name,
        us.status,
        us.end_date
      FROM user_subscriptions us
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ?
      ORDER BY us.id DESC
      LIMIT 1`,
      [req.session.userId]
    );

    if (rows.length === 0) {
      // Auto-create an inactive subscription if none exists
      const [[plan]] = await db.query(`SELECT id, duration_days FROM subscription_plans WHERE name = 'Premium Access' LIMIT 1`);
      if (!plan) {
        return res.status(500).json({ success: false, message: 'Subscription plan not found.' });
      }
      const now = new Date();
      const endDate = new Date(now.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);
      await db.query(
        `INSERT INTO user_subscriptions (user_id, plan_id, status, start_date, end_date)
         VALUES (?, ?, 'inactive', ?, ?)`,
        [req.session.userId, plan.id, now, endDate]
      );
      // Reflect status in users table (optional consistency)
      await db.query(`UPDATE users SET subscription_status = 'inactive' WHERE id = ?`, [req.session.userId]);

      return res.json({ success: true, details: { plan_name: 'Premium Access', status: 'inactive', end_date: endDate } });
    }

    res.json({ success: true, details: rows[0] });
  } catch (error) {
    console.error('Failed to fetch subscription details:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { getSubscriptionDetails };

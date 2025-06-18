const db = require('./database/db');

// Returns { success: true, status: 'active' | 'inactive' | 'expired', end_date: <ISO string|null> }
// Assumes user_subscriptions table has columns: user_id, status, end_date
// and that `status` is stored as a string ('active', 'expired', 'inactive').
// The latest (most recent end_date) record is considered authoritative.
async function getSubscriptionStatus(req, res) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.session.userId;

    // Fetch the latest subscription for the user
    const [rows] = await db.query(
      `SELECT status, end_date 
         FROM user_subscriptions 
        WHERE user_id = ? 
        ORDER BY end_date DESC 
        LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ success: true, status: 'inactive', end_date: null });
    }

    const { status, end_date } = rows[0];
    return res.json({ success: true, status, end_date });
  } catch (err) {
    console.error('Failed to fetch subscription status:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { getSubscriptionStatus };

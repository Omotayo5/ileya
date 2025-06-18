const db = require('./db');
const { sendEmail } = require('./mailer');
const fetch = require('node-fetch');
require('dotenv').config();

/**
 * Confirm payment and activate the user's most-recent inactive subscription.
 * In real production this would be triggered by your payment provider's
 * webhook/callback containing reference information. For now we simply rely on
 * the logged-in user and activate their latest `inactive` row.
 */
async function confirmPayment(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'You must be logged in.' });
  }

  const userId = req.session.userId;

  try {
    const { transaction_id, tx_ref } = req.body;
    if (!transaction_id || !tx_ref) {
      return res.status(400).json({ success: false, message: 'Missing transaction details.' });
    }

    // 1️⃣ Verify with Flutterwave
    const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const verifyJson = await verifyRes.json();

    if (!verifyRes.ok || verifyJson.status !== 'success' || verifyJson.data.status !== 'successful') {
            console.error('Flutterwave verification failed:', verifyJson);

      // Send payment failed email
      const [userRows] = await db.query('SELECT first_name, email FROM users WHERE id = ?', [userId]);
      if (userRows.length > 0) {
        const user = userRows[0];
        sendEmail(user.email, 'Ileya Payment Failed', 'payment-failed.html', { "[User's Name]": user.first_name }).catch(console.error);
      }

      return res.status(400).json({ success: false, message: 'Unable to verify transaction.' });
    }

    const { amount, currency, tx_ref: returnedRef } = verifyJson.data;
    if (currency !== 'NGN' || Number(amount) < 499.99 || returnedRef !== tx_ref) {
            console.error('Verification mismatch. Expected NGN 499.99 and matching tx_ref. Got:', verifyJson.data);
      // Send payment failed email
      const [userRows] = await db.query('SELECT first_name, email FROM users WHERE id = ?', [userId]);
      if (userRows.length > 0) {
        const user = userRows[0];
        sendEmail(user.email, 'Ileya Payment Failed', 'payment-failed.html', { "[User's Name]": user.first_name }).catch(console.error);
      }

      return res.status(400).json({ success: false, message: 'Transaction details mismatch.' });
    }

    // 2️⃣ Find the newest inactive subscription row for this user
    const [rows] = await db.query(
      'SELECT id, plan_id, duration_days FROM user_subscriptions us JOIN subscription_plans sp ON sp.id = us.plan_id WHERE us.user_id = ? AND us.status = \"inactive\" ORDER BY us.id DESC LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No pending subscription to activate.' });
    }

    const sub = rows[0];

    // Activate subscription and set fresh start / end dates (30 days from now or plan.duration_days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + sub.duration_days);

    await db.query(
      'UPDATE user_subscriptions SET status = \"active\", start_date = ?, end_date = ? WHERE id = ?',
      [startDate, endDate, sub.id]
    );

    await db.query('UPDATE users SET subscription_status = \"active\" WHERE id = ?', [userId]);

        // Send success email
    const [userRows] = await db.query('SELECT first_name, email FROM users WHERE id = ?', [userId]);
    if (userRows.length > 0) {
      const user = userRows[0];
      const emailData = {
        "[User's Name]": user.first_name,
        "[Transaction ID]": transaction_id,
        "[Activation Date]": new Date(startDate).toLocaleDateString('en-GB'),
        "[Expiry Date]": new Date(endDate).toLocaleDateString('en-GB'),
        // TODO: Populate these from .env or a config file
        "[Dashboard URL]": 'http://localhost:3002/dashboard.html',
        "[Website URL]": 'http://localhost:3002/'
      };
      sendEmail(user.email, 'Subscription Activated!', 'payment-success.html', emailData).catch(console.error);
    }

    return res.json({ success: true, message: 'Payment confirmed. Subscription is now active!' });
  } catch (err) {
    console.error('Payment confirmation failed:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { confirmPayment };

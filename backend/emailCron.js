const cron = require('node-cron');
const db = require('./db');
const { sendEmail } = require('./mailer');

console.log('Email cron jobs module loaded.');

// --- Helper function to send emails in batches to avoid overwhelming the mail server ---
async function sendBatchEmails(users, subject, templateName, basePlaceholders) {
  for (const user of users) {
    if (!user.email) continue;

    const placeholders = {
      ...basePlaceholders,
      "[User's Name]": user.first_name || 'Valued User',
    };

    try {
      await sendEmail(user.email, subject, templateName, placeholders);
      console.log(`Sent ${templateName} to ${user.email}`);
    } catch (error) {
      console.error(`Failed to send ${templateName} to ${user.email}:`, error);
    }
    // Small delay between emails
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// --- Cron Job 1: Subscription Reminder (Twice a day at 10 AM and 6 PM) ---
// This job targets users whose subscription is not 'active'.
cron.schedule('0 10,18 * * *', async () => {
  console.log('Running subscription reminder cron job...');
  try {
    const [inactiveUsers] = await db.query(
      `SELECT id, first_name, email FROM users WHERE subscription_status != 'active'`
    );

    if (inactiveUsers.length === 0) {
      console.log('No inactive users to remind.');
      return;
    }

    console.log(`Found ${inactiveUsers.length} user(s) to remind.`);
    const placeholders = {
      '[Subscription URL]': `${process.env.BASE_URL}/subscription.html`,
      '[Website URL]': process.env.BASE_URL
    };
    await sendBatchEmails(inactiveUsers, 'Unlock Premium Access on Ileya', 'subscription-reminder.html', placeholders);

  } catch (error) {
    console.error('Error running subscription reminder cron job:', error);
  }
}, {
  timezone: "Africa/Lagos" // Using WAT timezone
});

// --- Cron Job 2: Daily Engagement (Once a day at 8 AM) ---
// This job targets ALL users.
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily engagement cron job...');
  try {
    const [allUsers] = await db.query('SELECT id, first_name, email FROM users');

    if (allUsers.length === 0) {
      console.log('No users to engage.');
      return;
    }

    console.log(`Found ${allUsers.length} total user(s) to engage.`);
    const placeholders = {
      '[Dashboard URL]': `${process.env.BASE_URL}/dashboard.html`,
      '[Website URL]': process.env.BASE_URL
    };
    await sendBatchEmails(allUsers, 'Fresh Listings Alert!', 'daily-engagement.html', placeholders);

  } catch (error) {
    console.error('Error running daily engagement cron job:', error);
  }
}, {
  timezone: "Africa/Lagos" // Using WAT timezone
});

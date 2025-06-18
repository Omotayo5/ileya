const pool = require('./database/db');
const { sendEmail } = require('./mailer');
require('dotenv').config();

const submitReview = async (req, res) => {
    const reviewerId = req.session.user ? req.session.user.id : null;
    const { listerId, rating, comment } = req.body;

    if (!reviewerId) {
        return res.status(401).json({ success: false, message: 'You must be logged in to submit a review.' });
    }

    if (!listerId || !rating) {
        return res.status(400).json({ success: false, message: 'Lister ID and rating are required.' });
    }

    const ratingInt = parseInt(rating, 10);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
    }

    if (parseInt(reviewerId, 10) === parseInt(listerId, 10)) {
        return res.status(403).json({ success: false, message: 'You cannot review yourself.' });
    }

    const connection = await pool.getConnection();

    try {
        // Check if the user has already reviewed this lister
        const [existingReviews] = await connection.execute(
            'SELECT id FROM reviews WHERE lister_id = ? AND reviewer_id = ?',
            [listerId, reviewerId]
        );

        if (existingReviews.length > 0) {
            return res.status(409).json({ success: false, message: 'You have already submitted a review for this lister.' });
        }

        // Insert the new review
        const query = 'INSERT INTO reviews (lister_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?)';
        await connection.execute(query, [listerId, reviewerId, ratingInt, comment || null]);

                // --- Send Email Notifications ---
        try {
            // 1. Get user details for both reviewer and agent
            const [users] = await connection.execute(
                'SELECT id, first_name, email FROM users WHERE id IN (?, ?)',
                [reviewerId, listerId]
            );
            const reviewer = users.find(u => u.id == reviewerId);
            const agent = users.find(u => u.id == listerId);

            if (reviewer && agent) {
                // 2. Send 'Thank You' email to the reviewer
                const reviewerEmailData = {
                    "[Reviewer's Name]": reviewer.first_name,
                    "[Agent's Name]": agent.first_name,
                    "[Review Content]": comment || 'No comment provided.',
                    "[Rating]": ratingInt,
                    "[Website URL]": process.env.BASE_URL
                };
                sendEmail(reviewer.email, 'Thank You for Your Review!', 'review-submitted.html', reviewerEmailData)
                    .catch(err => console.error(`Failed to send review submission email to ${reviewer.email}:`, err));

                // 3. Send 'New Review' notification to the agent
                const agentEmailData = {
                    "[Agent's Name]": agent.first_name,
                    "[Reviewer's Name]": reviewer.first_name,
                    "[Review Content]": comment || 'No comment provided.',
                    "[Rating]": ratingInt,
                    "[Profile URL]": `${process.env.BASE_URL}/lister-profile.html?listerId=${listerId}`
                };
                sendEmail(agent.email, 'You Have a New Review!', 'agent-review-received.html', agentEmailData)
                    .catch(err => console.error(`Failed to send new review notification to ${agent.email}:`, err));
            }
        } catch (emailError) {
            console.error('Failed to send review notification emails:', emailError);
            // Do not block the user response if emails fail
        }

        res.status(201).json({ success: true, message: 'Review submitted successfully.' });

    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { submitReview };

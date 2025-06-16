const pool = require('./db');

const getListerProfile = async (req, res) => {
    const { id } = req.params;
    const viewerId = req.session.user ? req.session.user.id : null;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Lister ID is required.' });
    }

    const connection = await pool.getConnection();

    try {
        // Fetch lister's basic info
        // Fetch lister's basic info, including phone number
        const [users] = await connection.execute('SELECT id, full_name, profile_picture, created_at, phone_number FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Lister not found.' });
        }
        const lister = users[0];

        // Fetch property stats using a more efficient query
        const [statsResult] = await connection.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'deleted' THEN 1 ELSE 0 END) as deleted
            FROM rentals 
            WHERE user_id = ?
        `, [id]);

        const stats = {
            total: statsResult[0].total || 0,
            deleted: statsResult[0].deleted || 0
        };

        // Fetch reviews
        const reviewsQuery = `
            SELECT 
                r.id, r.rating, r.comment, r.created_at, 
                u.full_name as reviewer_name, u.profile_picture as reviewer_image
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.lister_id = ?
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await connection.execute(reviewsQuery, [id]);

        res.json({
            success: true,
            lister: {
                ...lister,
                stats: stats,
                reviews
            },
            viewerId // Send back the viewer's ID to conditionally show the review form
        });

    } catch (error) {
        console.error('Error fetching lister profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getListerProfile };

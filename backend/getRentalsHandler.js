const pool = require('./database/db');

// Fetch rentals for the logged-in user
const getMyRentals = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
        }
        const userId = req.session.user.id;

        const sql = `
            SELECT id, title, rental_price, state, city, property_type, bedrooms, status, photos
            FROM rentals 
            WHERE user_id = ? AND status = 'active' 
            ORDER BY created_at DESC
        `;

        const [rentals] = await pool.execute(sql, [userId]);

        // The 'photos' column is a JSON string, so we parse it for the frontend.
        const processedRentals = rentals.map(rental => {
            const photoArr = JSON.parse(rental.photos || '[]').map(p => {
                if (!p) return p;
                if (/^https?:\/\//.test(p) || p.startsWith('/uploads')) {
                    return p;
                }
                if (p.includes('uploads/') && !p.startsWith('/')) {
                    return '/' + p;
                }
                return p;
            });
            return { ...rental, photos: photoArr };
        });

        res.status(200).json({ success: true, rentals: processedRentals });

    } catch (error) {
        console.error('Error fetching user rentals:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching your rentals.' });
    }
};

// Fetch all rentals for the public marketplace
const getAllRentals = async (req, res) => {
    try {
        const sql = `
            SELECT id, title, rental_price, state, city, property_type, bedrooms, status, photos
            FROM rentals 
            WHERE status = 'active' 
            ORDER BY created_at DESC
        `;

        const [rentals] = await pool.execute(sql);

        // The 'photos' column is a JSON string, so we parse it.
        const processedRentals = rentals.map(rental => {
            const photoArr = JSON.parse(rental.photos || '[]').map(p => {
                if (!p) return p;
                if (/^https?:\/\//.test(p) || p.startsWith('/uploads')) {
                    return p;
                }
                if (p.includes('uploads/') && !p.startsWith('/')) {
                    return '/' + p;
                }
                return p;
            });
            return { ...rental, photos: photoArr };
        });

        res.status(200).json({ success: true, rentals: processedRentals });

    } catch (error) {
        console.error('Error fetching all rentals:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching rentals.' });
    }
};

module.exports = { getMyRentals, getAllRentals };

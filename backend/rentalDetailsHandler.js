const db = require('./database/db');

const getRentalById = async (req, res) => {
                const { id } = req.params;

        if (!id) {

        return res.status(400).json({ success: false, message: 'Property ID is required.' });
    }

    try {
        // The query now fetches rental details from the database.
        const query = `
            SELECT r.*, u.full_name AS lister_name, u.profile_picture AS lister_profile_picture
            FROM rentals r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ?
        `;
        const [rows] = await db.query(query, [id]);

                if (rows.length === 0) {

            return res.status(404).json({ success: false, message: 'Rental not found' });
        }

                const rental = rows[0];

        // The 'features' and 'photos' columns are stored as JSON strings.
        // They need to be parsed before being sent to the client.
        try {
            rental.features = JSON.parse(rental.features);
        } catch (e) {
            console.error(`Error parsing features JSON for rental ${id}:`, e);
            rental.features = []; // Default to an empty array if parsing fails
        }

                try {
            let photos = JSON.parse(rental.photos || '[]');
            // Normalize photo paths while preserving uploads directory
            rental.photos = photos.map(photo => {
                if (!photo) return photo;
                // If already absolute external URL or starts with /uploads, keep as-is
                if (/^https?:\/\//.test(photo) || photo.startsWith('/uploads')) {
                    return photo;
                }
                // If contains uploads directory but missing leading slash
                if (photo.includes('uploads/') && !photo.startsWith('/')) {
                    return '/' + photo;
                }
                // Otherwise leave it (just filename) - frontend will prefix
                return photo;
            });
        } catch (e) {
            console.error(`Error parsing or cleaning photos JSON for rental ${id}:`, e);
            rental.photos = []; // Default to empty array on error
        }

        // Send the successfully retrieved and parsed rental data.
        
                res.json({ success: true, rental });

    } catch (error) {
                console.error('Error fetching rental by ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    getRentalById
};

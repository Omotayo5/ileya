// ileya-app/backend/rentalHandler.js
const pool = require('./db');

const baseQuery = `
    SELECT 
        r.id, r.title, r.city, r.state, r.rental_price, r.bedrooms, r.photos,
        u.id AS lister_id, 
        u.full_name AS lister_name, 
        u.profile_picture AS lister_profile_picture
    FROM rentals r
    JOIN users u ON r.user_id = u.id
    WHERE r.status = 'active'
`;

const processRentals = (rentals) => {
    return rentals.map(rental => {
        try {
            // The 'photos' column is TEXT, so we need to parse it as JSON
            const photos = JSON.parse(rental.photos);
            // Ensure photos is an array and not empty
            let photoPath = Array.isArray(photos) && photos.length > 0 ? photos[0] : null;
            // For legacy rows where full path is stored without a leading slash, prepend one
            if (photoPath && photoPath.includes('uploads/') && !photoPath.startsWith('/')) {
                photoPath = '/' + photoPath;
            }
            return {
                ...rental,
                photos: photoPath ? [photoPath] : [] // Keep it as an array for consistency
            };
        } catch (e) {
            // If parsing fails, return with an empty photos array
            return { ...rental, photos: [] };
        }
    });
};

// Function to get all rentals from the database with pagination
async function getAllRentals(req, res) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Query for the total count of rentals
        const [countResult] = await connection.execute(`SELECT COUNT(*) as total FROM rentals WHERE status = 'active'`);
        const totalRentals = countResult[0].total;

        // Query for the paginated rentals
        const finalQuery = baseQuery + ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
        const [rentals] = await connection.execute(finalQuery, [limit, offset]);
        
        const processedRentals = processRentals(rentals);
        
        res.status(200).json({ 
            success: true, 
            rentals: processedRentals,
            total: totalRentals,
            page: page,
            limit: limit
        });
    } catch (error) {
        console.error('Error fetching all rentals:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        if (connection) connection.release();
    }
}

// Function to get filtered rentals from the database with pagination
async function getFilteredRentals(req, res) {
    let connection;
    try {
        connection = await pool.getConnection();
        const { location, propertyType } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        
        let conditions = [];
        let params = [];
        let countParams = [];

        if (location) {
            conditions.push('(r.city = ? OR r.state = ?)');
            params.push(location, location);
            countParams.push(location, location);
        }

        if (propertyType) {
            conditions.push('r.property_type = ?');
            params.push(propertyType);
            countParams.push(propertyType);
        }

        const whereClause = conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';

        // Query for the total count of filtered rentals
        const countQuery = `SELECT COUNT(*) as total FROM rentals r WHERE r.status = 'active' ${whereClause}`;
        const [countResult] = await connection.execute(countQuery, countParams);
        const totalRentals = countResult[0].total;

        // Query for the paginated filtered rentals
        const finalQuery = baseQuery + whereClause + ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset); // Add limit and offset to the params for the final query

        const [rentals] = await connection.execute(finalQuery, params);
        const processedRentals = processRentals(rentals);

        res.status(200).json({ 
            success: true, 
            rentals: processedRentals,
            total: totalRentals,
            page: page,
            limit: limit
        });

    } catch (error) {
        console.error('Error fetching filtered rentals:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        if (connection) connection.release();
    }
}

const deleteRental = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'You must be logged in to delete a rental.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        // First, verify the rental belongs to the user
        const [rentals] = await connection.execute('SELECT user_id FROM rentals WHERE id = ?', [id]);
        if (rentals.length === 0) {
            return res.status(404).json({ success: false, message: 'Rental not found.' });
        }
        if (rentals[0].user_id !== userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this rental.' });
        }

        // Update the status to 'deleted'
        const [result] = await connection.execute("UPDATE rentals SET status = 'deleted' WHERE id = ?", [id]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Rental successfully deleted.' });
        } else {
            res.status(404).json({ success: false, message: 'Rental not found or no changes were made.' });
        }
    } catch (error) {
        console.error('Error deleting rental:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getAllRentals, getFilteredRentals, deleteRental };

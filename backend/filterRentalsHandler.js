const db = require('./database/db');

async function filterRentals(req, res) {
    const { location, propertyType, maxPrice } = req.query;

    let sql = 'SELECT * FROM rentals WHERE 1=1';
    const params = [];

    if (location) {
        sql += ' AND (city = ? OR state = ?)';
        params.push(location, location);
    }

    if (propertyType) {
        sql += ' AND property_type = ?';
        params.push(propertyType);
    }

    if (maxPrice) {
        sql += ' AND rental_price <= ?';
        params.push(maxPrice);
    }

    try {
        const [rentals] = await db.query(sql, params);
        
        const rentalsWithPhotos = await Promise.all(rentals.map(async (rental) => {
            const [photos] = await db.query('SELECT photo_filename FROM rental_photos WHERE rental_id = ?', [rental.id]);
            return {
                ...rental,
                photos: photos.map(p => p.photo_filename)
            };
        }));

        res.json({ success: true, rentals: rentalsWithPhotos });
    } catch (error) {
        console.error('Database error while filtering rentals:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching rentals.' });
    }
}

module.exports = { filterRentals };

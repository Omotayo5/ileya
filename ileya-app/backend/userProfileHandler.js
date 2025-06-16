 // c:\Users\USER\Documents\Ileya\ileya-app\backend\userProfileHandler.js
const pool = require('./database/db');
const multer = require('multer');
const path = require('path');

// --- Multer Setup for Profile Picture Uploads ---
// Define storage configuration for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // The destination directory for uploads. This path is relative to the project root.
        cb(null, 'ileya-app/uploads/avatars/');
    },
    filename: function (req, file, cb) {
        // Create a unique filename to prevent overwriting files with the same name.
        const userId = req.session.user.id;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `avatar-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image file.'), false);
    }
};

// Initialize multer with storage, file filter, and size limits (e.g., 5MB)
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter, 
    limits: { fileSize: 1024 * 1024 * 5 } 
});

// Middleware to protect routes that require a user to be logged in
function requireLogin(req, res, next) {
    console.log('--- requireLogin middleware triggered ---');
    console.log('Request Path:', req.path);
    console.log('Session ID:', req.sessionID);
    console.log('Session Exists:', !!req.session);
    console.log('Session User:', req.session ? req.session.user : 'No session user');

    if (req.session && req.session.user) {
        // Ensure a consistent userId field exists for other handlers
        req.session.userId = req.session.user.id;
        console.log('Authentication successful. Proceeding...');
        return next();
    } else {
        console.error('Authentication failed. User session not found or invalid.');
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }
}

// Handler to get the current user's profile data
async function getProfile(req, res) {
    const userId = req.session.user.id;

    try {
        // Get user info and rental stats in parallel
        const [userPromise, rentalStatsPromise] = await Promise.all([
            pool.execute('SELECT * FROM users WHERE id = ?', [userId]),
            pool.execute('SELECT status, COUNT(*) as count FROM rentals WHERE user_id = ? GROUP BY status', [userId])
        ]);

        const [users] = userPromise;
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const user = users[0];

        const [rentalStats] = rentalStatsPromise;
        const stats = {
            active: 0,
            deleted: 0
        };
        rentalStats.forEach(row => {
            if (row.status === 'active') {
                stats.active = row.count;
            } else if (row.status === 'deleted') {
                stats.deleted = row.count;
            }
        });

        // Always show either the user's profile picture or a fallback image
        const profilePicture = user.profile_picture ? `/${user.profile_picture}` : '/images/default-avatar.gif';

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                phoneNumber: user.phone_number || '',
                profilePicture: profilePicture,
                rentalStats: stats
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching profile.' });
    }
}

// Handler to update the user's profile (text fields)
async function updateProfile(req, res) {
    const userId = req.session.user.id;
    const { phoneNumber } = req.body;

    if (typeof phoneNumber === 'undefined') {
        return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    try {
        // First, check if a phone number already exists for this user
        const [users] = await pool.execute('SELECT phone_number FROM users WHERE id = ?', [userId]);

        if (users.length > 0 && users[0].phone_number) {
            // A phone number already exists, so it cannot be changed.
            return res.status(403).json({ success: false, message: 'Phone number has already been set and cannot be changed.' });
        }

        // If no phone number exists, proceed with the update
        await pool.execute(
            'UPDATE users SET phone_number = ? WHERE id = ?',
            [phoneNumber, userId]
        );
        res.status(200).json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, message: 'Server error while updating profile.' });
    }
}

// Handler for Profile Picture Upload
async function updateProfilePicture(req, res) {
    const userId = req.session.user.id;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded. Please select an image.' });
    }

    // Path to be stored in DB. This path will be used in the 'src' of image tags.
    // It's relative to the static path served by express.
    const filePath = `uploads/avatars/${req.file.filename}`;

    try {
        await pool.execute(
            'UPDATE users SET profile_picture = ? WHERE id = ?',
            [filePath, userId]
        );

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully.',
            // Send the new root-relative path back to the client
            filePath: `/${filePath}`
        });
    } catch (error) {
        console.error('Error updating profile picture in DB:', error);
        res.status(500).json({ success: false, message: 'Server error while updating profile picture.' });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    updateProfilePicture,
    requireLogin,
    upload // Export multer instance for use in router
};

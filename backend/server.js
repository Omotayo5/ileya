const path = require('path');


// c:\Users\USER\Documents\Ileya\server.js
const express = require('express');

// Root folder where frontend lives after restructure
const FRONTEND_ROOT = path.join(__dirname, '..', 'frontend');
const fs = require('fs');
const { handleRegistration } = require('./registerHandler');
const { handleLogin } = require('./loginHandler');
const session = require('express-session');
const { getProfile, updateProfile, requireLogin, upload, updateProfilePicture } = require('./userProfileHandler');
const { createRental } = require('./createRentalHandler');
const { getMyRentals } = require('./getRentalsHandler');
const rentalHandler = require('./rentalHandler');
const { getRentalById } = require('./rentalDetailsHandler');
const subscriptionHandler = require('./subscriptionHandler');
const { confirmPayment } = require('./paymentConfirmHandler');
const { getSubscriptionStatus } = require('./subscriptionStatusHandler');
const { getSubscriptionDetails } = require('./subscriptionDetailsHandler');
const { getListerProfile } = require('./listerProfileHandler');
const { submitReview } = require('./reviewHandler');
const { handleReport } = require('./reportHandler');
const { handleForgotPassword, handleResetPassword } = require('./passwordResetHandler');
const multer = require('multer');
const { pool: dbPool } = require('./db'); // Import raw pool for graceful shutdown
require('./subscriptionCron');
require('./emailCron'); // Schedule daily subscription status updates

// Ensure the upload directories exist
const uploadsDirAvatars = path.join(FRONTEND_ROOT, 'uploads', 'avatars');
if (!fs.existsSync(uploadsDirAvatars)) {
    fs.mkdirSync(uploadsDirAvatars, { recursive: true });
    console.log(`Created directory: ${uploadsDirAvatars}`);
}
const uploadsDirProperties = path.join(FRONTEND_ROOT, 'uploads', 'properties');
if (!fs.existsSync(uploadsDirProperties)) {
    fs.mkdirSync(uploadsDirProperties, { recursive: true });
    console.log(`Created directory: ${uploadsDirProperties}`);
}

// Ensure rentals upload directory exists
const uploadsDirRentals = path.join(FRONTEND_ROOT, 'uploads', 'rentals');
if (!fs.existsSync(uploadsDirRentals)) {
    fs.mkdirSync(uploadsDirRentals, { recursive: true });
    console.log(`Created directory: ${uploadsDirRentals}`);
}

// Add detailed logging
console.log('Starting Ileya server...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');

const app = express();

const port = process.env.PORT || 3002; // Changed default port to 3002 to avoid conflicts
console.log('Using port:', port);

// Middleware to parse URL-encoded data (form submissions)
console.log('Setting up URL-encoded body parser...');
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
console.log('Setting up JSON body parser...');
app.use(express.json());

// Session middleware
// IMPORTANT: In a production environment, use a more secure secret and configure session store.
app.use(session({
  secret: 'your-very-secret-key-that-is-long-and-random', // Replace with a real secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if you're using https
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from the rebuilt frontend directory
app.use(express.static(FRONTEND_ROOT));

// Serve uploaded files (avatars, rentals, etc.)
// 1) New location inside frontend folder
app.use('/uploads', express.static(path.join(FRONTEND_ROOT, 'uploads')));
// 2) Legacy location inside backend/uploads (before restructure)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for rental photos
const rentalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirRentals);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const rentalUpload = multer({ storage: rentalStorage, fileFilter: imageFileFilter });

// API route for registration
app.post('/api/register', handleRegistration);

// API route for login
app.post('/api/login', handleLogin);

// API routes for user profile
app.get('/api/profile', requireLogin, getProfile); // Get user data
app.put('/api/profile', requireLogin, updateProfile); // Update user data

// API route for profile picture upload. The 'upload.single('profilePicture')' is multer middleware.
app.post('/api/profile/picture', requireLogin, upload.single('profilePicture'), updateProfilePicture);

// Rental Management Routes
app.post('/api/rentals/create', requireLogin, rentalUpload.array('photos', 6), createRental);
app.get('/api/rentals/my-rentals', requireLogin, getMyRentals);
// New routes for fetching and filtering rentals
app.get('/api/rentals', rentalHandler.getAllRentals);
app.get('/api/rentals/filter', rentalHandler.getFilteredRentals);

app.get('/api/rentals/:id', getRentalById);
app.delete('/api/rentals/:id', requireLogin, rentalHandler.deleteRental);


// Subscription Route
app.post('/api/subscribe', requireLogin, subscriptionHandler);

// Payment confirmation (stub)
app.post('/api/payment/confirm', requireLogin, confirmPayment);

// Subscription status
app.get('/api/subscription-status', getSubscriptionStatus);
app.get('/api/subscription-details', requireLogin, getSubscriptionDetails);

// Lister Profile Route
app.get('/api/listers/:id', getListerProfile);

// Review Submission Route
app.post('/api/reviews', requireLogin, submitReview);

// Lister Report Route
app.post('/api/listers/:id/report', requireLogin, handleReport);

// Password Reset Routes
app.post('/api/forgot-password', handleForgotPassword);
app.post('/api/reset-password', handleResetPassword);

// Basic route for the root, serves index.html from the ileya-app directory
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'index.html'));
});

function startServer(p) {
  const srv = app.listen(p, () => {
    console.log(`Ileya server listening at http://localhost:${p}`);
  });

  srv.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${p} is in use, trying port ${p + 1}...`);
      startServer(p + 1); // Try next port
    } else {
      throw err;
    }
  });

  return srv;
}

const server = startServer(port);

// Graceful shutdown logic
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    console.log('✅ HTTP server closed.');
    dbPool.end(err => {
      if (err) {
        console.error('❌ Error closing the database connection pool:', err);
        process.exit(1);
      }
      console.log('✅ Database connection pool closed.');
      process.exit(0);
    });
  });

  // Force shutdown after a timeout
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000); // 10 seconds
};

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle nodemon restarts gracefully (SIGUSR2)
process.once('SIGUSR2', () => {
  gracefulShutdown('SIGUSR2');
  // Give gracefulShutdown time to finish before nodemon restarts
  setTimeout(() => {
    process.kill(process.pid, 'SIGUSR2');
  }, 500);
});

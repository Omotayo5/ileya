// c:\Users\USER\Documents\Ileya\server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const { handleRegistration } = require('./ileya-app/backend/registerHandler');
const { handleLogin } = require('./ileya-app/backend/loginHandler');
const session = require('express-session');
const { getProfile, updateProfile, requireLogin, upload, updateProfilePicture } = require('./ileya-app/backend/userProfileHandler');
const { createRental } = require('./ileya-app/backend/createRentalHandler');
const { getMyRentals } = require('./ileya-app/backend/getRentalsHandler');
const rentalHandler = require('./ileya-app/backend/rentalHandler');
const { getRentalById } = require('./ileya-app/backend/rentalDetailsHandler');
const subscriptionHandler = require('./ileya-app/backend/subscriptionHandler');
const { confirmPayment } = require('./ileya-app/backend/paymentConfirmHandler');
const { getSubscriptionStatus } = require('./ileya-app/backend/subscriptionStatusHandler');
const { getSubscriptionDetails } = require('./ileya-app/backend/subscriptionDetailsHandler');
const { getListerProfile } = require('./ileya-app/backend/listerProfileHandler');
const { submitReview } = require('./ileya-app/backend/reviewHandler');
const { handleReport } = require('./ileya-app/backend/reportHandler');
const { handleForgotPassword, handleResetPassword } = require('./ileya-app/backend/passwordResetHandler');
const multer = require('multer');
const { pool: dbPool } = require('./ileya-app/backend/db'); // Import raw pool for graceful shutdown
require('./ileya-app/backend/subscriptionCron');
require('./ileya-app/backend/emailCron'); // Schedule daily subscription status updates

// Ensure the upload directories exist
const uploadsDirAvatars = path.join(__dirname, 'ileya-app', 'uploads', 'avatars');
if (!fs.existsSync(uploadsDirAvatars)) {
    fs.mkdirSync(uploadsDirAvatars, { recursive: true });
    console.log(`Created directory: ${uploadsDirAvatars}`);
}
const uploadsDirProperties = path.join(__dirname, 'ileya-app', 'uploads', 'properties');
if (!fs.existsSync(uploadsDirProperties)) {
    fs.mkdirSync(uploadsDirProperties, { recursive: true });
    console.log(`Created directory: ${uploadsDirProperties}`);
}

// Ensure rentals upload directory exists
const uploadsDirRentals = path.join(__dirname, 'ileya-app', 'uploads', 'rentals');
if (!fs.existsSync(uploadsDirRentals)) {
    fs.mkdirSync(uploadsDirRentals, { recursive: true });
    console.log(`Created directory: ${uploadsDirRentals}`);
}

const app = express();

const port = process.env.PORT || 3002; // Changed default port to 3002 to avoid conflicts

// Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
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

// Serve static files from the 'ileya-app' directory
// This makes files like register.html accessible via http://localhost:3000/register.html
app.use(express.static(path.join(__dirname, 'ileya-app')));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'ileya-app/uploads')));

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
  res.sendFile(path.join(__dirname, 'ileya-app', 'index.html'));
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

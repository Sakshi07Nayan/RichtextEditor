const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/db');
const initializePassport = require('./config/passport');
const cors = require('cors');
// const cookieSession = require("cookie-session");
const session = require('express-session'); // Change this
const MongoStore = require('connect-mongo'); 

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors setup
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5000'],
    credentials: true
  }));

// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["somesessionkey"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );
app.use(
    session({
        secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 24 * 60 * 60 // 1 day
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
    })
);
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
  });

// Import routes
const authRoute = require('./routes/authRoute');
const contentRoute = require('./routes/contentRoute');

// Routes
app.use('/api/auth', authRoute);
app.use('/api/content', contentRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

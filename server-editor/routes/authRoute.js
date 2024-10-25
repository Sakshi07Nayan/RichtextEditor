const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const { body, validationResult } = require('express-validator');
const authorizeUser = require('../middleware/authUser');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Registration validation
const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty()
];

// Local Registration
router.post('/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            name,
            authType: 'local'
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                authType: user.authType
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Local Login
router.post('/login', passport.authenticate('local', { session: false }),
    (req, res) => {
        const token = generateToken(req.user);
        res.json({
            token,
            user: {
                id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                authType: req.user.authType
            }
        });
    });

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Loged In",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

// Google Auth Routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login'
    }),
    (req, res) => {
        const token = generateToken(req.user);
        // Redirect to frontend with token
        res.redirect(
            `${process.env.CLIENT_URL}/auth/success?token=${token}`
        );
    });


// Get current user
router.get('/me', authorizeUser, (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized: User not found"
      });
    }
  
    res.status(200).json({
      error: false,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        authType: req.user.authType,
        profilePicture: req.user.profilePicture
      }
    });
  });

//   router.post("/logout", (req, res) => {
//     // Check if session exists
//     if (req.session) {
//         console.log("Session exists:", req.session);

//         // Clear the JWT token if stored in a cookie
//         res.clearCookie('token');

//         // Destroy the session
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({
//                     error: true,
//                     message: "Error during logout",
//                     details: err.message
//                 });
//             }

//             // Passport logout
//             req.logout((err) => {
//                 if (err) {
//                     return res.status(500).json({
//                         error: true,
//                         message: "Error during logout",
//                         details: err.message
//                     });
//                 }

//                 res.status(200).json({
//                     error: false,
//                     message: "Successfully logged out"
//                 });
//             });
//         });
//     } else {
//         console.log("No active session found for logout.");
//         res.status(400).json({
//             error: true,
//             message: "No active session to log out from"
//         });
//     }
// });

router.post("/logout", (req, res) => {
    // Clear the JWT token if stored in a cookie
    res.clearCookie('token');
    
    // Passport logout
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ 
                error: true, 
                message: "Error during logout",
                details: err.message 
            });
        }
        
        // Clear session
        if (req.session) {
            req.session = null;
        }
        
        res.status(200).json({ 
            error: false, 
            message: "Successfully logged out" 
        });
    });
});


module.exports = router;
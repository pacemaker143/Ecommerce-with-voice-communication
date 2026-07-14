const jwt = require('jsonwebtoken');
const User = require('../models/User');   

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);

            // Support both { id } (new) and { user: { _id } } (old) token formats
            const userId = decoded.id || (decoded.user && (decoded.user._id || decoded.user.id));
            if (!userId) {
                return res.status(401).json({ message: 'Invalid token payload — please log in again' });
            }

            req.user = await User.findById(userId).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error("Auth error:", error);
            res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }   
};

//Middleware to check admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === ' ') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
};


module.exports = { protect, admin };
// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const userSchema = require('../schemas/userModel');

const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // --- THIS IS THE FIX ---
            // Find the user by ID from the token and ATTACH it to the request object.
            req.user = await userSchema.findById(decoded.id).select('-password');
            
            // Handle case where user might have been deleted after token was issued
            if (!req.user) {
                return res.status(401).send({ message: "Not authorized, user not found", success: false });
            }

            // Proceed to the next step (the controller)
            next();

        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).send({ message: 'Not authorized, token failed', success: false });
        }
    }

    if (!token) {
        return res.status(401).send({ message: 'Not authorized, no token provided', success: false });
    }
};

module.exports = authMiddleware;
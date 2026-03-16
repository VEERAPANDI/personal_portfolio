const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header (expecting "Bearer <token>" or just "<token>")
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7, authHeader.length) : authHeader;

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token (using SITEKEY as the secret like in adminRoutes)
        const secret = process.env.SITEKEY || 'defaultsecretkey';
        const decoded = jwt.verify(token, secret);
        
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;

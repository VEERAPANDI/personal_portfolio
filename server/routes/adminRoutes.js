const adminRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const ADMIN = {
    name: process.env.SITENAME,
    server: process.env.SITEUSER // Simple hardcoded for demo
};

adminRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN.name && password === ADMIN.server) {
        const payload = { user: username };
        const secret = process.env.SITEKEY || 'defaultsecretkey';

        // Sign the token with 1 hour expiration
        jwt.sign(
            payload,
            secret,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: username });
            }
        );
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = adminRouter;

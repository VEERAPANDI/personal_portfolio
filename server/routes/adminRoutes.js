const adminRouter = require('express').Router();

const ADMIN = {
    name: process.env.SITENAME,
    server: process.env.SITEUSER // Simple hardcoded for demo
};

adminRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN.name && password === ADMIN.server) {
        res.json({ token: process.env.SITEKEY, user: username });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = adminRouter;

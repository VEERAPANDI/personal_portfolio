const adminRouter = require('express').Router();

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'password123' // Simple hardcoded for demo
};

adminRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login Attempt:', req.body); // Debugging
    console.log('Expected:', ADMIN_CREDENTIALS); // Debugging
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        res.json({ token: 'dummy-jwt-token-replace-in-production', user: username });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = adminRouter;

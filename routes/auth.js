const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, mobile, password, gender, roll_number } = req.body;
        if (!email.endsWith('@kitsw.ac.in'))
            return res.status(400).json({ message: 'Email must end with @kitsw.ac.in' });
        if (String(mobile).length !== 10)
            return res.status(400).json({ message: 'Mobile must be 10 digits' });
        if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password))
            return res.status(400).json({ message: 'Password must contain uppercase, number, special character' });
        if (!roll_number || roll_number.trim() === '')
            return res.status(400).json({ message: 'Roll number is required' });

        const [existing] = await db.execute('SELECT id FROM users WHERE email = ? OR roll_number = ?', [email, roll_number.trim().toUpperCase()]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email or roll number already registered' });

        const hashed = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (username, email, mobile, password, gender, roll_number) VALUES (?,?,?,?,?,?)',
            [username, email, mobile, hashed, gender, roll_number.trim().toUpperCase()]
        );
        res.status(201).json({ message: 'Registered successfully' });
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
        const user = users[0];
        if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign(
            { id: user.id, gender: user.gender, username: user.username, roll_number: user.roll_number, email: user.email },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, username: user.username, gender: user.gender, roll_number: user.roll_number, email: user.email } });
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;

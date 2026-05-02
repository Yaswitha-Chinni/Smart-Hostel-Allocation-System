const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Hardcoded admin credentials for simplicity
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// ── Admin Login Route ──────────────────────────────────────────────
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign(
            { role: 'admin', username: ADMIN_USER },
            process.env.JWT_SECRET || 'kitsw_hostel_secret_key_123',
            { expiresIn: '24h' }
        );
        return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// ── Admin Auth Middleware ──────────────────────────────────────────
function adminAuth(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kitsw_hostel_secret_key_123');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid admin token' });
    }
}

// ── Get All Students Data ──────────────────────────────────────────
router.get('/students', adminAuth, async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, u.username, u.roll_number, u.email, u.mobile, u.gender,
                IFNULL(b.status, 'Pending') AS booking_status, 
                r.room_number, r.floor, r.type, b.token_number
            FROM users u
            LEFT JOIN bookings b ON u.id = b.user_id
            LEFT JOIN rooms r ON b.room_id = r.room_id
            ORDER BY u.roll_number ASC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error fetching student data' });
    }
});

module.exports = router;

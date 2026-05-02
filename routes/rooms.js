const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const jwt     = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
    catch { res.status(401).json({ message: 'Token invalid' }); }
};

// GET /api/rooms?floor=&type=
router.get('/', auth, async (req, res) => {
    try {
        const { floor, type } = req.query;
        const gender = req.user.gender;
        let query = 'SELECT * FROM rooms WHERE hostel_type = ?';
        const params = [gender];
        if (floor && floor !== 'All') { query += ' AND floor = ?'; params.push(floor); }
        if (type  && type  !== 'All') { query += ' AND type = ?';  params.push(type); }
        const [rooms] = await db.execute(query, params);

        // Fetch booked students for each room
        const result = await Promise.all(rooms.map(async room => {
            const [students] = await db.execute(
                'SELECT u.roll_number, u.username FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.room_id = ?',
                [room.room_id]
            );
            return { ...room, booked_students: students };
        }));
        res.json(result);
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

// GET /api/rooms/:id/bookings
router.get('/:id/bookings', auth, async (req, res) => {
    try {
        const [students] = await db.execute(
            'SELECT u.roll_number, u.username FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.room_id = ?',
            [req.params.id]
        );
        res.json(students);
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;

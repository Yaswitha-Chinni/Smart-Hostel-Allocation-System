const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Generate unique token number: KITSW + 4 random digits
function generateToken() {
    return 'KITSW' + Math.floor(1000 + Math.random() * 9000);
}

// Book a room
router.post('/book', auth, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { room_id } = req.body;
        const user_id = req.user.id;

        // Check if user already has a booking
        const [existingBooking] = await connection.execute('SELECT * FROM bookings WHERE user_id = ?', [user_id]);
        if (existingBooking.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'You have already booked a room' });
        }

        // Check if room exists and is not full
        const [roomData] = await connection.execute('SELECT * FROM rooms WHERE room_id = ? FOR UPDATE', [room_id]);
        if (roomData.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Room not found' });
        }

        const room = roomData[0];
        if (room.available_slots <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Room is full' });
        }

        // Generate token
        const token_number = generateToken();

        // Insert booking with token
        await connection.execute(
            'INSERT INTO bookings (user_id, room_id, token_number) VALUES (?, ?, ?)',
            [user_id, room_id, token_number]
        );

        // Decrement available slots
        await connection.execute(
            'UPDATE rooms SET available_slots = available_slots - 1 WHERE room_id = ?',
            [room_id]
        );

        await connection.commit();
        res.status(201).json({ message: 'Room booked successfully', token_number });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// Get user's booking status
router.get('/status', auth, async (req, res) => {
    try {
        const user_id = req.user.id;
        const [bookings] = await db.execute(
            `SELECT b.*, r.room_number, r.floor, r.type
             FROM bookings b
             JOIN rooms r ON b.room_id = r.room_id
             WHERE b.user_id = ?`,
            [user_id]
        );

        if (bookings.length === 0) {
            return res.json({ booked: false });
        }

        res.json({ booked: true, booking: bookings[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

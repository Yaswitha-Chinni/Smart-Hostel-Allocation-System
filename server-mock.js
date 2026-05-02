const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'kitsw_hostel_secret_2024';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-Memory Store ──────────────────────────────────────────────
const users = [];
let userIdCounter = 1;
const rooms = [];
let roomIdCounter = 1;
const bookings = [];
let bookingIdCounter = 1;

function generateToken() {
    return 'KITSW' + Math.floor(1000 + Math.random() * 9000);
}

function seedRooms() {
    const add = (nums, floor, type) => {
        ['Male', 'Female'].forEach(gender => {
            nums.forEach(num => {
                rooms.push({
                    room_id: roomIdCounter++,
                    room_number: String(num),
                    floor, type,
                    capacity: 4,
                    available_slots: 4,
                    hostel_type: gender
                });
            });
        });
    };
    // Ground Floor
    add([101,102,103,104,105,116,117,118,119,120], 'Ground', 'Non Attached + Non AC');
    add([106,107,108,109,110,111,112,113,114,115], 'Ground', 'AC + Attached');
    add([121,122,123,124,125,126],                 'Ground', 'Attached + Non AC');
    // 1st Floor
    add(Array.from({length:20}, (_,i) => 201+i), '1st', 'Non Attached + Non AC');
    add(Array.from({length:25}, (_,i) => 221+i), '1st', 'Attached + Non AC');
    // 2nd Floor
    add(Array.from({length:20}, (_,i) => 301+i), '2nd', 'Non Attached + Non AC');
    add(Array.from({length:25}, (_,i) => 321+i), '2nd', 'Attached + Non AC');
}
seedRooms();

// ── Auth Middleware ───────────────────────────────────────────────
function auth(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });
    try { req.user = jwt.verify(token, JWT_SECRET); next(); }
    catch { res.status(401).json({ message: 'Token invalid' }); }
}

// ── Auth Routes ───────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
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
        if (users.find(u => u.email === email))
            return res.status(400).json({ message: 'Email already registered' });
        if (users.find(u => u.roll_number === roll_number.trim().toUpperCase()))
            return res.status(400).json({ message: 'Roll number already registered' });
        const hashed = await bcrypt.hash(password, 10);
        users.push({ id: userIdCounter++, username, email, mobile, password: hashed, gender, roll_number: roll_number.trim().toUpperCase() });
        res.status(201).json({ message: 'Registered successfully' });
    } catch { res.status(500).json({ message: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user || !await bcrypt.compare(password, user.password))
            return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign(
            { id: user.id, gender: user.gender, username: user.username, roll_number: user.roll_number, email: user.email },
            JWT_SECRET, { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, username: user.username, gender: user.gender, roll_number: user.roll_number, email: user.email } });
    } catch { res.status(500).json({ message: 'Server error' }); }
});

// ── Rooms Routes ──────────────────────────────────────────────────
app.get('/api/rooms', auth, (req, res) => {
    const { floor, type } = req.query;
    const gender = req.user.gender;
    let list = rooms.filter(r => r.hostel_type === gender);
    if (floor && floor !== 'All') list = list.filter(r => r.floor === floor);
    if (type  && type  !== 'All') list = list.filter(r => r.type  === type);
    const result = list.map(room => {
        const roomBookings = bookings.filter(b => b.room_id === room.room_id);
        const booked_students = roomBookings.map(b => {
            const u = users.find(u => u.id === b.user_id);
            return { roll_number: u?.roll_number || '-', username: u?.username || '-' };
        });
        return { ...room, booked_students };
    });
    res.json(result);
});

app.get('/api/rooms/:id/bookings', auth, (req, res) => {
    const room_id = parseInt(req.params.id);
    const roomBookings = bookings.filter(b => b.room_id === room_id);
    const students = roomBookings.map(b => {
        const u = users.find(u => u.id === b.user_id);
        return { roll_number: u?.roll_number || '-', username: u?.username || '-' };
    });
    res.json(students);
});

// ── Booking Routes ────────────────────────────────────────────────
app.post('/api/bookings/book', auth, (req, res) => {
    const { room_id } = req.body;
    const user_id = req.user.id;
    if (bookings.find(b => b.user_id === user_id))
        return res.status(400).json({ message: 'You have already booked a room' });
    const room = rooms.find(r => r.room_id === room_id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.available_slots <= 0) return res.status(400).json({ message: 'Room is full' });
    const token_number = generateToken();
    room.available_slots--;
    const u = users.find(u => u.id === user_id);
    bookings.push({ id: bookingIdCounter++, user_id, room_id, token_number, status: 'Booked', roll_number: u?.roll_number, username: u?.username, booked_at: new Date().toISOString() });
    res.status(201).json({ message: 'Room booked successfully', token_number });
});

app.get('/api/bookings/status', auth, (req, res) => {
    const booking = bookings.find(b => b.user_id === req.user.id);
    if (!booking) return res.json({ booked: false });
    const room = rooms.find(r => r.room_id === booking.room_id);
    res.json({ booked: true, booking: { ...booking, room_number: room?.room_number, floor: room?.floor, type: room?.type } });
});

// ── Fallback ──────────────────────────────────────────────────────
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

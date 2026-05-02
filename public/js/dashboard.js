document.addEventListener('DOMContentLoaded', () => {
    const user  = getUser();
    const token = getToken();
    if (!user || !token) return;

    // ── Elements ─────────────────────────────────────────────────
    const roomGrid        = document.getElementById('room-grid');
    const hostelName      = document.getElementById('hostel-name');
    const userDisplay     = document.getElementById('user-display');
    const floorFilter     = document.getElementById('floor-filter');
    const typeFilter      = document.getElementById('type-filter');
    const logoutBtn       = document.getElementById('logout-btn');
    const bookingInfoBox  = document.getElementById('booking-info-box');
    const noBookingBox    = document.getElementById('no-booking-box');
    const bookingRoomText = document.getElementById('booking-room-text');
    const bookingTokenText= document.getElementById('booking-token-text');
    const bookingStatus   = document.getElementById('booking-status');

    // Profile dropdown elements
    const profileBtn      = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const pdAvatar        = document.getElementById('pd-avatar');
    const pdName          = document.getElementById('pd-name');
    const pdRoll          = document.getElementById('pd-roll');
    const pdEmail         = document.getElementById('pd-email');
    const pdStatus        = document.getElementById('pd-status');
    const pdBookingDetails= document.getElementById('pd-booking-details');
    const pdRoom          = document.getElementById('pd-room');
    const pdFloor         = document.getElementById('pd-floor');
    const pdToken         = document.getElementById('pd-token');

    // ── Init ──────────────────────────────────────────────────────
    const initial = user.username ? user.username[0].toUpperCase() : 'U';
    profileBtn.textContent = initial;
    pdAvatar.textContent   = initial;
    userDisplay.textContent= user.roll_number || user.username;
    hostelName.textContent = user.gender === 'Female' ? '🏠 Girls Hostel' : '🏠 Boys Hostel';

    pdName.textContent  = user.username;
    pdRoll.textContent  = user.roll_number || '-';
    pdEmail.textContent = user.email || '-';

    // ── Profile Toggle ────────────────────────────────────────────
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => profileDropdown.classList.remove('open'));
    profileDropdown.addEventListener('click', e => e.stopPropagation());

    // ── Load Rooms + Status ───────────────────────────────────────
    async function loadRooms() {
        const floor = floorFilter.value;
        const type  = typeFilter.value;
        try {
            const [roomsRes, statusRes] = await Promise.all([
                fetch(`${API_URL}/rooms?floor=${floor}&type=${encodeURIComponent(type)}`, { headers:{ Authorization:`Bearer ${token}` } }),
                fetch(`${API_URL}/bookings/status`, { headers:{ Authorization:`Bearer ${token}` } })
            ]);
            const rooms      = await roomsRes.json();
            const statusData = await statusRes.json();
            updateBookingUI(statusData);
            renderRooms(rooms, statusData);
        } catch { showAlert('Failed to load rooms'); }
    }

    function updateBookingUI(statusData) {
        if (statusData.booked) {
            bookingInfoBox.style.display = 'flex';
            noBookingBox.style.display   = 'none';
            bookingRoomText.textContent  = `✅ You have booked Room ${statusData.booking.room_number} (${statusData.booking.floor} Floor)`;
            bookingTokenText.innerHTML   = `<span class="token-line">Token No: ${statusData.booking.token_number || 'N/A'}</span>`;
            bookingStatus.textContent    = `Booked • ${statusData.booking.type}`;
            bookingStatus.style.color    = 'var(--success)';
            // Update profile dropdown
            pdStatus.className           = 'badge-booked';
            pdStatus.textContent         = 'Booked';
            pdBookingDetails.style.display = 'block';
            pdRoom.textContent           = `Room ${statusData.booking.room_number}`;
            pdFloor.textContent          = `${statusData.booking.floor} Floor`;
            pdToken.textContent          = statusData.booking.token_number || 'N/A';
        } else {
            bookingInfoBox.style.display = 'none';
            noBookingBox.style.display   = 'block';
            bookingStatus.textContent    = '';
            pdStatus.className           = 'badge-pending';
            pdStatus.textContent         = 'Pending';
            pdBookingDetails.style.display = 'none';
        }
    }

    function renderRooms(rooms, statusData) {
        roomGrid.innerHTML = '';
        if (!rooms || rooms.length === 0) {
            roomGrid.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1;padding:3rem 0;font-size:.95rem;">No rooms found for selected filters.</p>';
            return;
        }
        rooms.forEach(room => {
            const isFull    = room.available_slots <= 0;
            const isBooked  = statusData.booked;
            const card      = document.createElement('div');
            card.className  = `room-card ${isFull ? 'full' : 'available'}`;

            // Booked students list
            const students  = room.booked_students || [];
            let studentsHTML = '';
            if (students.length > 0) {
                studentsHTML = students.map(s => `<div class="student-item"><span class="student-roll">${s.roll_number}</span> - ${s.username}</div>`).join('');
            } else {
                studentsHTML = '<div class="no-students">No bookings yet</div>';
            }

            card.innerHTML = `
                <div class="room-header">
                    <span class="room-number">Room ${room.room_number}</span>
                    <span class="room-type-badge">${room.type}</span>
                </div>
                <div class="room-meta">📍 Floor: <strong>${room.floor}</strong></div>
                <div class="room-meta">👥 Capacity: <strong>${room.capacity} members</strong></div>
                <div class="room-slots">
                    <span class="status-dot ${isFull ? 'red' : 'green'}"></span>
                    <span><strong>${room.available_slots}</strong> / ${room.capacity} slots available</span>
                    <span class="status-badge ${isFull ? 'full' : 'available'}">${isFull ? 'Full' : 'Available'}</span>
                </div>
                <div class="booked-students-section">
                    <div class="booked-students-title">📋 Booked Students</div>
                    ${studentsHTML}
                </div>
                <button class="btn-book" ${isFull || isBooked ? 'disabled' : ''} onclick="bookRoom(${room.room_id})">
                    ${isBooked ? '✔ Already Booked' : isFull ? '❌ Room Full' : '📌 Book Now'}
                </button>`;
            roomGrid.appendChild(card);
        });
    }

    // ── Book Room ─────────────────────────────────────────────────
    window.bookRoom = async (roomId) => {
        if (!confirm('Confirm booking for this room?')) return;
        try {
            const res  = await fetch(`${API_URL}/bookings/book`, {
                method:'POST',
                headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
                body: JSON.stringify({ room_id: roomId })
            });
            const data = await res.json();
            if (res.ok) { showAlert(`Booked! Token: ${data.token_number}`, 'success'); loadRooms(); }
            else showAlert(data.message);
        } catch { showAlert('Booking failed'); }
    };

    // ── Event Listeners ───────────────────────────────────────────
    floorFilter.addEventListener('change', loadRooms);
    typeFilter.addEventListener('change', loadRooms);
    logoutBtn.addEventListener('click', logout);
    loadRooms();
});

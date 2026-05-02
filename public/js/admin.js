document.addEventListener('DOMContentLoaded', () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        window.location.href = 'admin-login.html';
        return;
    }

    const tableBody = document.getElementById('student-table-body');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const genderFilter = document.getElementById('gender-filter');
    const logoutBtn = document.getElementById('admin-logout-btn');

    let allStudents = [];

    async function fetchStudents() {
        try {
            const res = await fetch(`${API_URL}/admin/students`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('adminToken');
                window.location.href = 'admin-login.html';
                return;
            }

            allStudents = await res.json();
            renderTable();
        } catch (err) {
            showAlert('Failed to fetch student data');
        }
    }

    function renderTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusVal = statusFilter.value;
        const genderVal = genderFilter.value;

        const filtered = allStudents.filter(s => {
            const matchesSearch = s.username.toLowerCase().includes(searchTerm) || s.roll_number.toLowerCase().includes(searchTerm);
            const matchesStatus = statusVal === 'All' || s.booking_status === statusVal;
            const matchesGender = genderVal === 'All' || s.gender === genderVal;
            return matchesSearch && matchesStatus && matchesGender;
        });

        tableBody.innerHTML = '';

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--muted);">No students found matching filters</td></tr>`;
            return;
        }

        filtered.forEach(s => {
            const tr = document.createElement('tr');
            
            const statusClass = s.booking_status === 'Booked' ? 'booked' : 'pending';
            
            tr.innerHTML = `
                <td><strong>${s.roll_number}</strong></td>
                <td>
                    <div>${s.username}</div>
                    <div style="font-size: 0.8rem; color: var(--muted);">${s.email} • ${s.mobile}</div>
                </td>
                <td>${s.gender}</td>
                <td><span class="status-badge ${statusClass}">${s.booking_status}</span></td>
                <td>${s.room_number || '-'}</td>
                <td>${s.floor || '-'}</td>
                <td><code style="background:#f1f5f9; padding:0.2rem 0.5rem; border-radius:4px;">${s.token_number || '-'}</code></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    searchInput.addEventListener('input', renderTable);
    statusFilter.addEventListener('change', renderTable);
    genderFilter.addEventListener('change', renderTable);

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = 'admin-login.html';
    });

    // Initial fetch
    fetchStudents();
});

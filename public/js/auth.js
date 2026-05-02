document.addEventListener('DOMContentLoaded', () => {
    const loginForm    = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email    = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res  = await fetch(`${API_URL}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
                const data = await res.json();
                if (res.ok) { setToken(data.token); setUser(data.user); window.location.href = 'dashboard.html'; }
                else showAlert(data.message);
            } catch { showAlert('Server connection failed'); }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username         = document.getElementById('username').value;
            const roll_number      = document.getElementById('roll_number').value;
            const email            = document.getElementById('email').value;
            const mobile           = document.getElementById('mobile').value;
            const gender           = document.getElementById('gender').value;
            const password         = document.getElementById('password').value;
            const confirmPassword  = document.getElementById('confirm-password').value;

            if (!email.endsWith('@kitsw.ac.in'))   return showAlert('Email must be @kitsw.ac.in');
            if (mobile.length !== 10)               return showAlert('Mobile must be 10 digits');
            if (password !== confirmPassword)        return showAlert('Passwords do not match');
            if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password))
                return showAlert('Password must contain uppercase, number, and special character');
            if (!roll_number.trim())                return showAlert('Roll number is required');

            try {
                const res  = await fetch(`${API_URL}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, roll_number, email, mobile, gender, password }) });
                const data = await res.json();
                if (res.ok) { showAlert('Registered successfully! Please login.', 'success'); setTimeout(() => window.location.href = 'index.html', 2000); }
                else showAlert(data.message);
            } catch { showAlert('Server connection failed'); }
        });
    }
});

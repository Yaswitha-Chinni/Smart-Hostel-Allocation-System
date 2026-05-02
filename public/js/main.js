const API_URL = '/api';

function showAlert(message, type = 'error') {
    const container = document.getElementById('alert-container');
    const el = document.createElement('div');
    el.className = `alert alert-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

function setToken(t) { localStorage.setItem('kitsw_token', t); }
function getToken()  { return localStorage.getItem('kitsw_token'); }
function setUser(u)  { localStorage.setItem('kitsw_user', JSON.stringify(u)); }
function getUser()   { const u = localStorage.getItem('kitsw_user'); return u ? JSON.parse(u) : null; }
function logout()    { localStorage.removeItem('kitsw_token'); localStorage.removeItem('kitsw_user'); window.location.href = 'index.html'; }

// Redirect guards
if (window.location.pathname.includes('dashboard.html') && !getToken()) window.location.href = 'index.html';
if ((window.location.pathname.endsWith('index.html') || window.location.pathname === '/') && getToken()) window.location.href = 'dashboard.html';

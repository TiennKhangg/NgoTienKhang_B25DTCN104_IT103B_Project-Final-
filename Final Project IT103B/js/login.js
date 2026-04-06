let loginForm = document.getElementById('login-form');
let loginMessage = document.getElementById('loginMessage');
function showLoginMessage(text, type = 'error') {
    loginMessage.textContent = text;
    loginMessage.className = `message ${type}`;
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function getSavedUsers() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some(user => user.role === 'admin');
    if (!adminExists) {
        users.push({
            fullName: 'Admin',
            midName: 'Admin',
            email: 'admin@gmail.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString(),
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    return users;
}
function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}
window.addEventListener('DOMContentLoaded', () => {
    if (getQueryParam('registered') === '1') {
        showLoginMessage('Đăng ký thành công. Vui lòng đăng nhập.', 'success');
    }
});
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email) {
        showLoginMessage('Email không được để trống.', 'error');
        return;
    }
    if (!validateEmail(email)) {
        showLoginMessage('Email phải đúng định dạng.', 'error');
        return;
    }
    if (!password) {
        showLoginMessage('Mật khẩu không được để trống.', 'error');
        return;
    }
    const users = getSavedUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
        showLoginMessage('Email hoặc mật khẩu không đúng.', 'error');
        return;
    }
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    if (user.role === 'admin') {
        window.location.href = 'lession.html';
    } else {
        window.location.href = 'home.html';
    }
}); 
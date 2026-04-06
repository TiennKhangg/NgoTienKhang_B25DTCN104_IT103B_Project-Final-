// ========== BIẾN TOÀN CỤC ==========
const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('registerMessage');

// ========== HÀM HIỂN THỊ THÔNG BÁO ==========
/**
 * Hiển thị thông báo đăng ký (thành công hoặc lỗi)
 * @param {string} text - Nội dung thông báo
 * @param {string} type - Kiểu thông báo: 'error' hoặc 'success'
 */
function showRegisterMessage(text, type = 'error') {
    registerMessage.textContent = text;
    registerMessage.className = `message ${type}`;
}

// ========== HÀM KIỂM TRA DỮ LIỆU ==========
/**
 * Kiểm tra định dạng email có hợp lệ không
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} true nếu email hợp lệ, false nếu không
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== HÀM QUẢN LÝ NGƯỜI DÙNG ==========
/**
 * Lấy danh sách tất cả người dùng từ localStorage
 * Nếu chưa có tài khoản admin, sẽ tự động tạo
 * @returns {array} Mảng người dùng
 */
function getSavedUsers() {
    // Lấy dữ liệu từ localStorage (nếu không có thì là mảng rỗng)
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Kiểm tra xem có tài khoản admin chưa
    const adminExists = users.some(user => user.role === 'admin');
    
    // Nếu chưa có, tự động tạo tài khoản admin
    if (!adminExists) {
        users.push({
            fullName: 'Admin',
            midName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString(),
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    return users;
}

// ========== SỰ KIỆN ĐĂNG KÝ ==========

/**
 * Sự kiện khi user bấm nút đăng ký (submit form)
 */
registerForm.addEventListener('submit', (e) => {
    // Ngăn chặn hành động mặc định của form (reload trang)
    e.preventDefault();

    // Lấy dữ liệu từ form
    const midName = document.getElementById('midName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const agreeTerms = document.getElementById('reg-terms').checked;

    // ===== KIỂM TRA DỮ LIỆU NHẬP VÀO =====

    // Kiểm tra Họ và tên đệm không được để trống
    if (!midName) {
        showRegisterMessage('Họ và tên đệm không được để trống.', 'error');
        return;
    }

    // Kiểm tra Tên không được để trống
    if (!lastName) {
        showRegisterMessage('Tên không được để trống.', 'error');
        return;
    }

    // Kiểm tra Email không được để trống
    if (!email) {
        showRegisterMessage('Email không được để trống.', 'error');
        return;
    }

    // Kiểm tra định dạng Email
    if (!validateEmail(email)) {
        showRegisterMessage('Email phải đúng định dạng.', 'error');
        return;
    }

    // Kiểm tra Mật khẩu không được để trống
    if (!password) {
        showRegisterMessage('Mật khẩu không được để trống.', 'error');
        return;
    }

    // Kiểm tra Mật khẩu phải tối thiểu 8 ký tự
    if (password.length < 8) {
        showRegisterMessage('Mật khẩu tối thiểu 8 ký tự.', 'error');
        return;
    }

    // Kiểm tra User phải đồng ý với chính sách và điều khoản
    if (!agreeTerms) {
        showRegisterMessage('Bạn phải đồng ý với chính sách và điều khoản.', 'error');
        return;
    }

    // ===== KIỂM TRA EMAIL ĐÃ ĐƯỢC ĐĂNG KÝ CHƯA =====

    // Lấy danh sách tất cả người dùng
    const users = getSavedUsers();
    
    // Tìm người dùng với email khớp (không phân biệt hoa/thường)
    const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

    // Nếu email đã tồn tại, báo lỗi
    if (existingUser) {
        showRegisterMessage('Email này đã được đăng ký.', 'error');
        return;
    }

    // ===== ĐĂNG KÝ THÀNH CÔNG =====

    // Tạo tên đầy đủ (Họ tên + Tên)
    const fullName = `${midName} ${lastName}`;
    
    // Thêm người dùng mới vào danh sách
    users.push({
        fullName,
        midName,
        lastName,
        email: email.toLowerCase(),
        password,
        role: 'user',  // Người dùng mới có vai trò là 'user'
        createdAt: new Date().toISOString(),
    });

    // Lưu danh sách người dùng vào localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Chuyển hướng tới trang đăng nhập với tham số 'registered=1'
    window.location.href = 'login.html?registered=1';
});

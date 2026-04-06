const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
if (!loggedInUser) {
    window.location.href = 'login.html';
}
else if (loggedInUser.role === 'admin') {
    window.location.href = 'lession.html';
}

let logoutConfirmModal = document.getElementById('logoutConfirmModal');
let cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
let confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
let userDropdown = document.getElementById('userDropdown');
let userLogoutMenu = document.getElementById('userLogoutMenu');
let userLogoutBtn = document.getElementById('userLogoutBtn');
let instagramUserDropdown = document.getElementById('instagramUserDropdown');
let instagramLogoutMenu = document.getElementById('instagramLogoutMenu');
let instagramLogoutBtn = document.getElementById('instagramLogoutBtn');
const openLogoutModal = (event) => {
    event.stopPropagation();
    if (logoutConfirmModal) {
        logoutConfirmModal.style.display = 'flex';
    }
};
let closeLogoutModal = () => {
    if (logoutConfirmModal) {
        logoutConfirmModal.style.display = 'none';
    }
};

if (userDropdown && userLogoutMenu && userLogoutBtn) {
    userDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
        userLogoutMenu.classList.toggle('visible');
    });
    userLogoutBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        userLogoutMenu.classList.remove('visible');
        openLogoutModal(event);
    });
    document.addEventListener('click', (event) => {
        if (!userDropdown.contains(event.target)) {
            userLogoutMenu.classList.remove('visible');
        }
    });
}

if (instagramUserDropdown && instagramLogoutMenu && instagramLogoutBtn) {
    instagramUserDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
        instagramLogoutMenu.classList.toggle('visible');
    });
    instagramLogoutBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        instagramLogoutMenu.classList.remove('visible');
        openLogoutModal(event);
    });
    document.addEventListener('click', (event) => {
        if (!instagramUserDropdown.contains(event.target)) {
            instagramLogoutMenu.classList.remove('visible');
        }
    });
}

if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', closeLogoutModal);
}

if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });
}

document.addEventListener('click', (event) => {
    if (logoutConfirmModal && event.target === logoutConfirmModal) {
        closeLogoutModal();
    }
});

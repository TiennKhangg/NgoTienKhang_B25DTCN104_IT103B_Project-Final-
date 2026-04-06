const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
if (!loggedInUser || loggedInUser.role !== 'admin') {
    showMessage('Bạn không có quyền truy cập trang này.');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 3000);
}
let lessons = [
    { id: '1', name: 'Session 01 - Tổng quan về HTML', subject: 'HTML/CSS', time: 45, status: 'completed', createdAt: new Date('2023-01-01') },
    { id: '2', name: 'Session 02 - Thẻ Inline và Block', subject: 'HTML/CSS', time: 60, status: 'incomplete', createdAt: new Date('2023-01-02') },
    { id: '3', name: 'Session 03 - Form và Table', subject: 'HTML/CSS', time: 40, status: 'completed', createdAt: new Date('2023-01-03') },
    { id: '4', name: 'Session 04 - CSS cơ bản', subject: 'HTML/CSS', time: 45, status: 'incomplete', createdAt: new Date('2023-01-04') },
    { id: '5', name: 'Session 05 - CSS layout', subject: 'HTML/CSS', time: 60, status: 'incomplete', createdAt: new Date('2023-01-05') },
    { id: '6', name: 'Session 06 - CSS Flex box', subject: 'HTML/CSS', time: 45, status: 'incomplete', createdAt: new Date('2023-01-06') },
    { id: '7', name: 'Session 07 - JavaScript cơ bản', subject: 'JavaScript', time: 50, status: 'incomplete', createdAt: new Date('2023-01-07') },
    { id: '8', name: 'Session 08 - React cơ bản', subject: 'React', time: 55, status: 'incomplete', createdAt: new Date('2023-01-08') }
];
let currentPage = 1;
let pageSize = 6;
let currentFilter = 'all';
let currentSort = 'name';
let searchQuery = '';
let editLessonId = null;
let deleteLessonId = null;
function showMessage(message) {
    const notificationBox = document.getElementById('notifySuccess');
    const messageText = document.getElementById('notifyMessage');
    if (messageText) messageText.textContent = message;
    if (notificationBox) {
        notificationBox.style.display = 'block';
        setTimeout(() => {
            notificationBox.style.display = 'none';
        }, 3000);
    }
}
function getFilteredLessons() {
    let filtered = lessons;
        if (currentFilter !== 'all') {
        filtered = filtered.filter(lesson => lesson.subject === currentFilter);
    }
    if (searchQuery) {
        filtered = filtered.filter(lesson => 
            lesson.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    if (currentSort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'createdAt') {
        filtered.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    return filtered;
}

function renderLessons() {
    const filteredLessons = getFilteredLessons();
    const totalPages = Math.max(1, Math.ceil(filteredLessons.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * pageSize;
    const pageLessons = filteredLessons.slice(startIndex, startIndex + pageSize);
    const tbody = document.getElementById('lessonTableBody');
    tbody.innerHTML = pageLessons.map(lesson => `
        <tr data-id="${lesson.id}" class="${lesson.status === 'completed' ? 'completed' : ''}">
            <!-- Checkbox đánh dấu hoàn thành -->
            <td>
                <input type="checkbox" 
                       ${lesson.status === 'completed' ? 'checked' : ''} 
                       onchange="toggleLessonStatus('${lesson.id}')">
            </td>
            <!-- Tên bài học -->
            <td>${lesson.name}</td>
            <!-- Thời gian học -->
            <td>${lesson.time}</td>
            <!-- Trạng thái -->
            <td>
                <span class="status ${lesson.status === 'completed' ? 'st-active' : 'st-inactive'}">
                    ● ${lesson.status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                </span>
            </td>
            <!-- Nút xóa và sửa -->
            <td class="actions-cell">
                <i class="trash" onclick="showDeleteModal('${lesson.id}')">
                    <img src="../assets/images/trash-2.png" alt="Xóa">
                </i>
                <i class="pencil" onclick="showEditForm('${lesson.id}')">
                    <img src="../assets/images/edit-2.png" alt="Sửa">
                </i>
            </td>
        </tr>
    `).join('');
    renderPagination(totalPages);
}
function renderPagination(totalPages) {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    let html = `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>`;

    // Tạo nút cho mỗi trang
    for (let page = 1; page <= totalPages; page++) {
        html += `<button class="${currentPage === page ? 'pg-active' : ''}" onclick="changePage(${page})">${page}</button>`;
    }

    // Tạo nút "Trang sau"
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&gt;</button>`;
    
    container.innerHTML = html;
}
function changePage(page) {
    currentPage = page;
    renderLessons();
}
function filterLessons() {
    searchQuery = document.getElementById('searchInput').value;
    currentPage = 1;
    renderLessons();
}

function sortLessons() {
    currentSort = document.getElementById('sortSelect').value;
    currentPage = 1;
    renderLessons();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('subjectFilter').addEventListener('change', function() {
        currentFilter = this.value;
        currentPage = 1;
        renderLessons();
    });
    renderLessons();
});
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('#lessonTableBody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
}
function toggleLessonStatus(id) {
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
        lesson.status = lesson.status === 'completed' ? 'incomplete' : 'completed';
        renderLessons();
    }
}

function showAddForm() {
    document.getElementById('modalAdd').style.display = 'flex';
    document.getElementById('lessonName').value = '';
    document.getElementById('lessonSubject').value = '';
    document.getElementById('lessonTime').value = '';
    document.querySelector('input[name="lessonStatus"][value="incomplete"]').checked = true;
    document.getElementById('addError').textContent = '';
}
function closeAddForm() {
    document.getElementById('modalAdd').style.display = 'none';
}
function addLesson() {
    const name = document.getElementById('lessonName').value.trim();
    const subject = document.getElementById('lessonSubject').value;
    const time = parseInt(document.getElementById('lessonTime').value);
    const status = document.querySelector('input[name="lessonStatus"]:checked').value;
    const errorElement = document.getElementById('addError');
    if (!name) {
        errorElement.textContent = 'Tên bài học không được để trống!';
        return;
    }
    if (lessons.some(l => l.name === name)) {
        errorElement.textContent = 'Tên bài học không được phép trùng!';
        return;
    }
    if (!subject) {
        errorElement.textContent = 'Môn học không được để trống!';
        return;
    }
    if (time <= 0) {
        errorElement.textContent = 'Thời gian học phải lớn hơn 0!';
        return;
    }
    const newLesson = {
        id: Date.now().toString(),
        name,
        subject,
        time,
        status,
        createdAt: new Date()
    };
        lessons.unshift(newLesson);
    closeAddForm();
    renderLessons();
    showMessage('Thêm bài học thành công!');
}
function showEditForm(id) {
    editLessonId = id;
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;
    document.getElementById('modalEdit').style.display = 'flex';
    document.getElementById('editLessonName').value = lesson.name;
    document.getElementById('editLessonSubject').value = lesson.subject;
    document.getElementById('editLessonTime').value = lesson.time;
    document.querySelector(`input[name="editLessonStatus"][value="${lesson.status}"]`).checked = true;
    document.getElementById('editError').textContent = '';
}
function closeEditForm() {
    document.getElementById('modalEdit').style.display = 'none';
}
function updateLesson() {
    const name = document.getElementById('editLessonName').value.trim();
    const subject = document.getElementById('editLessonSubject').value;
    const time = parseInt(document.getElementById('editLessonTime').value);
    const status = document.querySelector('input[name="editLessonStatus"]:checked').value;
    const errorElement = document.getElementById('editError');
    if (!name) {
        errorElement.textContent = 'Tên bài học không được để trống!';
        return;
    }
    if (lessons.some(l => l.id !== editLessonId && l.name === name)) {
        errorElement.textContent = 'Tên bài học không được phép trùng!';
        return;
    }
    if (!subject) {
        errorElement.textContent = 'Môn học không được để trống!';
        return;
    }
    if (time <= 0) {
        errorElement.textContent = 'Thời gian học phải lớn hơn 0!';
        return;
    }
    const lesson = lessons.find(l => l.id === editLessonId);
        if (lesson) {
        lesson.name = name;
        lesson.subject = subject;
        lesson.time = time;
        lesson.status = status;
    }
    closeEditForm();
    renderLessons();
    showMessage('Cập nhật bài học thành công!');
}

function showDeleteModal(id) {
    deleteLessonId = id;
    const lesson = lessons.find(l => l.id === id);
    document.getElementById('deleteMessage').textContent = 
        `Bạn có chắc chắn muốn xóa bài học "${lesson.name}" khỏi hệ thống không?`;
    document.getElementById('modalDelete').style.display = 'flex';
}
function closeDeleteModal() {
    document.getElementById('modalDelete').style.display = 'none';
}
function deleteLesson() {
    lessons = lessons.filter(l => l.id !== deleteLessonId);
    closeDeleteModal();
    renderLessons();
    showMessage('Xóa bài học thành công!');
}
document.getElementById('userDropdown')?.addEventListener('click', function() {
    document.getElementById('logoutMenu').classList.toggle('visible');
});
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    showMessage('Đăng xuất thành công.');
        setTimeout(() => {
        window.location.href = './login.html';
    }, 3000);
});
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown?.contains(e.target)) {
        document.getElementById('logoutMenu')?.classList.remove('visible');
    }
});
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        closeAddForm();
        closeEditForm();
        closeDeleteModal();
    }
});
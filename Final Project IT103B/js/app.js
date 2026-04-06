const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
if (!loggedInUser || loggedInUser.role !== 'admin') {
    showAccessMessage('Bạn không có quyền truy cập trang này.');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 3000);
}
const SUBJECTS_STORAGE_KEY = 'subjects';
const subjectTableBody = document.getElementById('subjectTableBody');
const paginationContainer = document.querySelector('.pagination');
const modalForm = document.getElementById('modalForm');
const modalDelete = document.getElementById('modalDelete');
const notificationBox = document.getElementById('notifySuccess');
const modalError = document.getElementById('modalError');
let editSubjectId = null;
let deleteSubjectId = null;
let currentPage = 1;
let currentStatusFilter = 'all';
const pageSize = 6;

const defaultSubjects = [
    { id: '1', name: 'Lập trình C', status: 'active' },
    { id: '2', name: 'HTML cơ bản', status: 'active' },
    { id: '3', name: 'CSS cơ bản', status: 'active' },
    { id: '4', name: 'JavaScript cơ bản', status: 'active' },
    { id: '5', name: 'Lập trình Frontend với ReactJS', status: 'inactive' },
    { id: '6', name: 'Lập trình Frontend với VueJS', status: 'inactive' },
    { id: '7', name: 'Phân tích và thiết kế hệ thống', status: 'inactive' }
];

function loadSubjectsFromStorage() {
    const saved = JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || 'null');
    return Array.isArray(saved) && saved.length ? saved : defaultSubjects.slice();
}

function saveSubjectsToStorage() {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
}

let subjects = loadSubjectsFromStorage();

// ========== HÀM TIỆN ÍCH ==========

// Chuyển đổi trạng thái thành htmn badage
function getStatusLabel(status) {
    return status === 'active'
        ? '<span class="status st-active">● Đang hoạt động</span>'
        : '<span class="status st-inactive">● Ngừng hoạt động</span>';
}

//THông báo bị từ chối
function showAccessMessage(message) {
    const notificationBox = document.getElementById('notifyAccess');
    const messageText = document.getElementById('notifyAccessMessage');
    if (messageText) messageText.textContent = message;
    if (notificationBox) {
        notificationBox.style.display = 'block';
        setTimeout(() => {
            notificationBox.style.display = 'none';
        }, 3000);
    }
}
// thông báo thành công
function showMessage(message) {
    if (!notificationBox) return;
    const messageText = document.getElementById('notifyMessage');
    if (messageText) messageText.textContent = message;
    notificationBox.style.display = 'block';
    setTimeout(() => {
        notificationBox.style.display = 'none';
    }, 3000);
}
// lọc trạng tháo
function getFilteredSubjects() {
    if (currentStatusFilter === 'all') {
        return subjects;
    }
    return subjects.filter(subject => subject.status === currentStatusFilter);
}

// Hiển thị danh sách môn học, phân trnag
function renderSubjects() {
    if (!subjectTableBody || !paginationContainer) return;
    const filteredSubjects = getFilteredSubjects();
        const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * pageSize;
        const pageSubjects = filteredSubjects.slice(startIndex, startIndex + pageSize);
    subjectTableBody.innerHTML = pageSubjects.length === 0
        ? '<tr><td colspan="3" class="empty-state">Chưa có môn học.</td></tr>'
        : pageSubjects.map((subject) => `
            <tr data-id="${subject.id}">
                <td>${subject.name}</td>
                <td>${getStatusLabel(subject.status)}</td>
                <td class="actions-cell">
                    <i  onclick="showDeleteConfirm(this)">
                        <img src="../assets/images/trash-2.png" alt="">
                    </i>
                    <i  onclick="showEditForm(this)">
                        <img src="../assets/images/edit-2.png" alt="">
                    </i>
                </td>
            </tr>
        `).join('');
    renderPagination(totalPages);
}
function renderPagination(totalPages) {
    if (!paginationContainer) return;
    const filteredSubjects = getFilteredSubjects();
        if (filteredSubjects.length === 0) {
        paginationContainer.innerHTML = '';
        return;
    }
    let html = `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&lt;</button>`;
    for (let page = 1; page <= totalPages; page++) {
        html += `<button class="${currentPage === page ? 'pg-active' : ''}" data-page="${page}">${page}</button>`;
    }
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">&gt;</button>`;
    
    paginationContainer.innerHTML = html;
}

//Thêm môn học
function showAddForm() {
    editSubjectId = null;
    document.getElementById('modalTitle').innerText = 'Thêm mới môn học';
    document.getElementById('btnSave').innerText = 'Thêm';
    document.getElementById('subjectName').value = '';
    document.getElementById('statusActive').checked = true;
    if (modalError) {
        modalError.textContent = '';
        modalError.classList.remove('show');
    }
    modalForm.style.display = 'flex';
}

//popup CHinh sửa
function showEditForm(icon) {
    const row = icon.closest('tr');
    editSubjectId = row.dataset.id;
    const subject = subjects.find((item) => item.id === editSubjectId);
    if (!subject) return;
    document.getElementById('modalTitle').innerText = 'Cập nhật môn học';
    document.getElementById('btnSave').innerText = 'Cập nhật';
    document.getElementById('subjectName').value = subject.name;
    document.getElementById('statusActive').checked = subject.status === 'active';
    document.getElementById('statusInactive').checked = subject.status !== 'active';
    if (modalError) {
        modalError.textContent = '';
        modalError.classList.remove('show');
    }
    modalForm.style.display = 'flex';
}

function closeForm() {
    modalForm.style.display = 'none';
}

// Thêm sửa
function saveSubject() {
    const name = document.getElementById('subjectName').value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    if (!name) {
        if (modalError) {
            modalError.textContent = 'Vui lòng nhập tên môn học!';
            modalError.classList.add('show');
        }
        return;
    }

    const isDuplicate = subjects.some(subject =>
        subject.name.trim().toLowerCase() === name.toLowerCase() &&
        subject.id !== editSubjectId
    );
    if (isDuplicate) {
        if (modalError) {
            modalError.textContent = 'Môn học này đã tồn tại!';
            modalError.classList.add('show');
        }
        return;
    }

    if (editSubjectId) {
        subjects = subjects.map((subject) => 
            subject.id === editSubjectId
                ? { ...subject, name, status }
                : subject
        );
        showMessage('Cập nhật môn học thành công.');
    } else {
        subjects.unshift({
            id: Date.now().toString(),
            name,
            status
        });
        currentPage = 1;
        showMessage('Thêm môn học thành công.');
    }

    saveSubjectsToStorage();
    renderSubjects();
    closeForm();
}

// popup xóa
function showDeleteConfirm(icon) {
    const row = icon.closest('tr');
    deleteSubjectId = row.dataset.id;
    const subject = subjects.find((item) => item.id === deleteSubjectId);
    const modalP = document.querySelector('#modalDelete p');
    modalP.innerHTML = `Bạn có chắc chắn muốn xóa môn học <strong>${subject ? subject.name : ''}</strong> khỏi hệ thống không?`;
    modalDelete.style.display = 'flex';
}
function closeDeleteConfirm() {
    modalDelete.style.display = 'none';
}
function deleteSubject() {
    if (!deleteSubjectId) return;
    subjects = subjects.filter((subject) => subject.id !== deleteSubjectId);
    saveSubjectsToStorage();
    deleteSubjectId = null;
    const filteredSubjects = getFilteredSubjects()
    const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    renderSubjects();
    closeDeleteConfirm();
    showMessage('Xóa môn học thành công.');
}

// TIm kiếm
function findLesson() {
    const search = document.getElementById('searchInput').value.trim().toLowerCase();
    let result = "";
    const filteredSubjects = getFilteredSubjects();
    for (let i = 0; i < filteredSubjects.length; i++) {
        if (filteredSubjects[i].name.toLowerCase().includes(search)) {
            result += `<tr data-id="${filteredSubjects[i].id}">
                <td>${filteredSubjects[i].name}</td>
                <td>${getStatusLabel(filteredSubjects[i].status)}</td>
                <td class="actions-cell">
                    <i class="fas fa-trash-alt trash" onclick="showDeleteConfirm(this)">
                        <img src="../assets/images/trash-2.png" alt="">
                    </i>
                    <i class="fas fa-pencil-alt pencil" onclick="showEditForm(this)">
                        <img src="../assets/images/edit-2.png" alt="">
                    </i>
                </td>
            </tr>`;
        }
    }
        subjectTableBody.innerHTML = result || '<tr><td colspan="3" class="empty-state">Không tìm thấy môn học.</td></tr>';
}

// Đăng suất
function logout() {
    localStorage.removeItem('loggedInUser');
    showMessage('Đăng xuất thành công.');
    setTimeout(() => {
        window.location.href = './login.html';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderSubjects();
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (event) => {
            currentStatusFilter = event.target.value;
            currentPage = 1;
            document.getElementById('searchInput').value = '';
            renderSubjects();
        });
    }

    // sự kiện phân trang ( chuyển trang)
    
    if (!paginationContainer) return;
    paginationContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button || button.disabled) return;
        const page = Number(button.dataset.page);
        if (!Number.isNaN(page)) {
            currentPage = page;
            renderSubjects();
        }
    });

    //popup 
    const userDropdown = document.getElementById('userDropdown');
    const logoutMenu = document.getElementById('logoutMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const userAvatar = document.querySelector('.user-avatar');
    if (userDropdown && logoutMenu && logoutBtn && userAvatar) {
        userAvatar.addEventListener('click', (event) => {
            event.stopPropagation();
            logoutMenu.classList.toggle('visible');
        });
        logoutBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            logoutMenu.classList.remove('visible');
            logout();
        });
        document.addEventListener('click', (event) => {
            if (!userDropdown.contains(event.target)) {
                logoutMenu.classList.remove('visible');
            }
        });
    }
});

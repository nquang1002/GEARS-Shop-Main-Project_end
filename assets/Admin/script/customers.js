// ============================================================================
// CUSTOMERS MANAGEMENT - Quản lý khách hàng với tìm kiếm và phân trang
// ============================================================================

let currentPage = 1;
const itemsPerPage = 10;
let allCustomers = [];
let filteredCustomers = [];

document.addEventListener('DOMContentLoaded', function() {
    loadCustomers();
    setupEventListeners();
});

// Hàm load danh sách khách hàng
function loadCustomers() {
    allCustomers = getLocalStorage('user') || [];
    filteredCustomers = [...allCustomers];
    displayCustomers();
}

// Hàm hiển thị khách hàng
function displayCustomers() {
    const tableElement = document.getElementById('customer-list');
    if (!tableElement) return;

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomers.length);
    const customersToDisplay = filteredCustomers.slice(startIndex, endIndex);

    // Tạo bảng
    let tableHTML = `
        <tr>
            <th>STT</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Ngày đăng ký</th>
            <th>Loại tài khoản</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
        </tr>
    `;

    if (customersToDisplay.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #999;">
                    Không tìm thấy khách hàng nào
                </td>
            </tr>
        `;
    } else {
        customersToDisplay.forEach((customer, index) => {
            const actualIndex = startIndex + index + 1;
            const status = customer.status || 'active';
            const statusText = status === 'locked' ? 'Bị khóa' : 'Hoạt động';
            const statusColor = status === 'locked' ? '#f44336' : '#4CAF50';
            const buttonText = status === 'locked' ? 'Mở khóa' : 'Khóa';
            const buttonColor = status === 'locked' ? '#4CAF50' : '#f44336';

            tableHTML += `
                <tr>
                    <td>${actualIndex}</td>
                    <td>${escapeHtml(customer.username)}</td>
                    <td>${escapeHtml(customer.gmail)}</td>
                    <td>${formatDate(customer.RegisterDay)}</td>
                    <td>
                        <span style="padding: 4px 8px; border-radius: 4px; background: ${customer.userType === 'admin' ? '#2196F3' : '#FF9800'}; color: white; font-size: 12px;">
                            ${customer.userType === 'admin' ? 'Admin' : 'Khách hàng'}
                        </span>
                    </td>
                    <td>
                        <span style="color: ${statusColor}; font-weight: 500;">
                            ${statusText}
                        </span>
                    </td>
                    <td>
                        <button class="btn-Product" onclick="resetPassword(${startIndex + index})" style="margin-right: 5px;">
                            Reset MK
                        </button>
                        <button class="btn-Product" onclick="toggleLock(${startIndex + index})" 
                            style="background: ${buttonColor};">
                            ${buttonText}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    tableElement.innerHTML = tableHTML;

    // Cập nhật thông tin phân trang
    updatePaginationInfo(startIndex + 1, endIndex, filteredCustomers.length);
    renderPagination(totalPages);
}

// Hàm render phân trang
function renderPagination(totalPages) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;

    let paginationHTML = '';

    // Nút Previous
    if (currentPage > 1) {
        paginationHTML += `
            <button class="btn-Product" onclick="goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Trước
            </button>
        `;
    }

    // Các nút trang
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<button class="btn-Product" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span style="padding: 8px;">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'style="background: #4CAF50; color: white;"' : '';
        paginationHTML += `
            <button class="btn-Product" onclick="goToPage(${i})" ${activeClass}>
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span style="padding: 8px;">...</span>`;
        }
        paginationHTML += `<button class="btn-Product" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Nút Next
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="btn-Product" onclick="goToPage(${currentPage + 1})">
                Sau <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    paginationElement.innerHTML = paginationHTML;
}

// Hàm chuyển trang
function goToPage(page) {
    currentPage = page;
    displayCustomers();
}

// Hàm cập nhật thông tin phân trang
function updatePaginationInfo(start, end, total) {
    document.getElementById('showing-start').textContent = start;
    document.getElementById('showing-end').textContent = end;
    document.getElementById('total-customers').textContent = total;
}

// Hàm tìm kiếm và lọc
function searchAndFilter() {
    const searchText = document.getElementById('search-customer').value.toLowerCase().trim();
    const filterType = document.getElementById('filter-type').value;
    const filterStatus = document.getElementById('filter-status').value;

    filteredCustomers = allCustomers.filter(customer => {
        // Tìm kiếm theo tên hoặc email
        const matchSearch = !searchText || 
            customer.username.toLowerCase().includes(searchText) ||
            customer.gmail.toLowerCase().includes(searchText);

        // Lọc theo loại tài khoản
        const matchType = !filterType || customer.userType === filterType;

        // Lọc theo trạng thái
        const customerStatus = customer.status || 'active';
        const matchStatus = !filterStatus || customerStatus === filterStatus;

        return matchSearch && matchType && matchStatus;
    });

    currentPage = 1; // Reset về trang 1
    displayCustomers();
}

// Hàm reset bộ lọc
function resetFilters() {
    document.getElementById('search-customer').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    filteredCustomers = [...allCustomers];
    currentPage = 1;
    displayCustomers();
}

// Hàm reset mật khẩu
function resetPassword(index) {
    if (!confirmDialog('Bạn có chắc chắn muốn reset mật khẩu cho tài khoản này?')) {
        return;
    }

    const users = getLocalStorage('user') || [];
    if (users[index]) {
        users[index].password = '123456'; // Mật khẩu mặc định
        setLocalStorage('user', users);
        showToast('Đã reset mật khẩu thành công! Mật khẩu mới: 123456', 'success');
        loadCustomers();
    }
}

// Hàm khóa/mở khóa tài khoản
function toggleLock(index) {
    const users = getLocalStorage('user') || [];
    if (users[index]) {
        const currentStatus = users[index].status || 'active';
        const newStatus = currentStatus === 'locked' ? 'active' : 'locked';
        const action = newStatus === 'locked' ? 'khóa' : 'mở khóa';

        if (!confirmDialog(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            return;
        }

        users[index].status = newStatus;
        setLocalStorage('user', users);
        showToast(`Đã ${action} tài khoản thành công!`, 'success');
        loadCustomers();
    }
}

// Hàm setup event listeners
function setupEventListeners() {
    const btnSearch = document.getElementById('btn-search');
    const btnReset = document.getElementById('btn-reset');
    const searchInput = document.getElementById('search-customer');

    if (btnSearch) {
        btnSearch.addEventListener('click', searchAndFilter);
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAndFilter();
            }
        });
    }
}

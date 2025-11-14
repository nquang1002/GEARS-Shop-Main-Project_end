// ============================================================================
// ORDERS MANAGEMENT - Quản lý đơn hàng
// ============================================================================

let currentPage = 1;
const itemsPerPage = 10;
let allOrders = [];
let filteredOrders = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeOrders();
    loadOrders();
    setupEventListeners();
});

function initializeOrders() {
    // Khởi tạo orders nếu chưa có
    if (!getLocalStorage('orders')) {
        setLocalStorage('orders', []);
    }
}

function loadOrders() {
    allOrders = getLocalStorage('orders') || [];
    filteredOrders = [...allOrders];
    displayOrders();
}

function displayOrders() {
    const tableElement = document.getElementById('orders-list');
    if (!tableElement) return;

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredOrders.length);
    const ordersToDisplay = filteredOrders.slice(startIndex, endIndex);

    let tableHTML = `
        <tr>
            <th>Mã ĐH</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
        </tr>
    `;

    if (ordersToDisplay.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #999;">
                    Không tìm thấy đơn hàng nào
                </td>
            </tr>
        `;
    } else {
        ordersToDisplay.forEach((order, index) => {
            const actualIndex = startIndex + index;
            const statusInfo = getStatusInfo(order.status || 'moi');
            
            tableHTML += `
                <tr>
                    <td>#${order.id || actualIndex + 1}</td>
                    <td>${escapeHtml(order.customerName || 'Khách vãng lai')}</td>
                    <td>${formatDate(order.date)}</td>
                    <td>${formatCurrency(order.total || 0)}</td>
                    <td>
                        <select onchange="updateOrderStatus(${actualIndex}, this.value)" 
                            class="input-field" style="padding: 6px; border-radius: 4px; background: ${statusInfo.color}; color: white; border: none;">
                            <option value="moi" ${order.status === 'moi' ? 'selected' : ''}>Mới đặt</option>
                            <option value="xuly" ${order.status === 'xuly' ? 'selected' : ''}>Đã xử lý</option>
                            <option value="giaohang" ${order.status === 'giaohang' ? 'selected' : ''}>Đã giao</option>
                            <option value="huy" ${order.status === 'huy' ? 'selected' : ''}>Huỷ</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn-Product" onclick="viewOrderDetail(${actualIndex})" style="background: #2196F3;">
                            <i class="fas fa-eye"></i> Xem
                        </button>
                        <button class="btn-Product" onclick="deleteOrder(${actualIndex})" style="background: #f44336;">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    tableElement.innerHTML = tableHTML;
    updatePaginationInfo(startIndex + 1, endIndex, filteredOrders.length);
    renderPagination(totalPages);
}

function getStatusInfo(status) {
    const statusMap = {
        'moi': { text: 'Mới đặt', color: '#FF9800' },
        'xuly': { text: 'Đã xử lý', color: '#2196F3' },
        'giaohang': { text: 'Đã giao', color: '#4CAF50' },
        'huy': { text: 'Huỷ', color: '#f44336' }
    };
    return statusMap[status] || statusMap['moi'];
}

function updateOrderStatus(index, newStatus) {
    const orders = getLocalStorage('orders') || [];
    const realIndex = allOrders.findIndex(o => o.id === filteredOrders[index].id);
    
    if (realIndex !== -1) {
        orders[realIndex].status = newStatus;
        setLocalStorage('orders', orders);
        showToast('Cập nhật trạng thái đơn hàng thành công!', 'success');
        loadOrders();
    }
}

function viewOrderDetail(index) {
    const order = filteredOrders[index];
    if (!order) return;

    let detailHTML = `
        <div style="margin-bottom: 20px;">
            <h3>Thông tin đơn hàng #${order.id}</h3>
            <p><strong>Khách hàng:</strong> ${escapeHtml(order.customerName || 'Khách vãng lai')}</p>
            <p><strong>Email:</strong> ${escapeHtml(order.customerEmail || 'N/A')}</p>
            <p><strong>Số điện thoại:</strong> ${order.customerPhone || 'N/A'}</p>
            <p><strong>Địa chỉ:</strong> ${escapeHtml(order.address || 'N/A')}</p>
            <p><strong>Ngày đặt:</strong> ${formatDate(order.date)}</p>
            <p><strong>Trạng thái:</strong> <span style="color: ${getStatusInfo(order.status).color}; font-weight: bold;">${getStatusInfo(order.status).text}</span></p>
        </div>

        <h4>Chi tiết sản phẩm:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Sản phẩm</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Số lượng</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Đơn giá</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Thành tiền</th>
            </tr>
    `;

    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            detailHTML += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(item.name)}</td>
                    <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatCurrency(item.price)}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatCurrency(item.price * item.quantity)}</td>
                </tr>
            `;
        });
    }

    detailHTML += `
            <tr style="background: #f5f5f5; font-weight: bold;">
                <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;">Tổng cộng:</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: #f44336;">${formatCurrency(order.total || 0)}</td>
            </tr>
        </table>

        ${order.note ? `<p style="margin-top: 20px;"><strong>Ghi chú:</strong> ${escapeHtml(order.note)}</p>` : ''}
    `;

    document.getElementById('order-detail-content').innerHTML = detailHTML;
    document.querySelector('.OrderDetail_Wrap').style.display = 'flex';
}

function deleteOrder(index) {
    const order = filteredOrders[index];
    if (!order) return;

    if (!confirmDialog(`Bạn có chắc chắn muốn xóa đơn hàng #${order.id}?`)) {
        return;
    }

    const orders = getLocalStorage('orders') || [];
    const realIndex = orders.findIndex(o => o.id === order.id);
    
    if (realIndex !== -1) {
        orders.splice(realIndex, 1);
        setLocalStorage('orders', orders);
        showToast('Xóa đơn hàng thành công!', 'success');
        loadOrders();
    }
}

function filterOrders() {
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const status = document.getElementById('filter-status').value;
    const customerName = document.getElementById('search-customer-name').value.toLowerCase().trim();

    filteredOrders = allOrders.filter(order => {
        // Filter by date
        let matchDate = true;
        if (startDate || endDate) {
            const orderDate = new Date(order.date);
            if (startDate && orderDate < new Date(startDate)) matchDate = false;
            if (endDate && orderDate > new Date(endDate)) matchDate = false;
        }

        // Filter by status
        const matchStatus = !status || order.status === status;

        // Filter by customer name
        const matchCustomer = !customerName || 
            (order.customerName && order.customerName.toLowerCase().includes(customerName));

        return matchDate && matchStatus && matchCustomer;
    });

    currentPage = 1;
    displayOrders();
}

function resetFilters() {
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('search-customer-name').value = '';
    filteredOrders = [...allOrders];
    currentPage = 1;
    displayOrders();
}

// ============================================================================
// PAGINATION FUNCTIONS
// ============================================================================

function renderPagination(totalPages) {
    const paginationElement = document.getElementById('pagination-orders');
    if (!paginationElement) return;

    let paginationHTML = '';

    if (currentPage > 1) {
        paginationHTML += `
            <button class="btn-Product" onclick="goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Trước
            </button>
        `;
    }

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
        paginationHTML += `<button class="btn-Product" onclick="goToPage(${i})" ${activeClass}>${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span style="padding: 8px;">...</span>`;
        }
        paginationHTML += `<button class="btn-Product" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="btn-Product" onclick="goToPage(${currentPage + 1})">
                Sau <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    paginationElement.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    displayOrders();
}

function updatePaginationInfo(start, end, total) {
    document.getElementById('showing-start').textContent = start;
    document.getElementById('showing-end').textContent = end;
    document.getElementById('total-orders').textContent = total;
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    const btnFilter = document.getElementById('btn-filter-orders');
    const btnReset = document.getElementById('btn-reset-orders');
    const btnCloseDetail = document.querySelector('.js-close-order-detail');

    if (btnFilter) btnFilter.addEventListener('click', filterOrders);
    if (btnReset) btnReset.addEventListener('click', resetFilters);
    if (btnCloseDetail) {
        btnCloseDetail.addEventListener('click', () => {
            document.querySelector('.OrderDetail_Wrap').style.display = 'none';
        });
    }
}

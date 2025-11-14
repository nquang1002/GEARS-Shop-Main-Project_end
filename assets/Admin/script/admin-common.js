// ============================================================================
// ADMIN COMMON - Các hàm dùng chung cho tất cả trang Admin
// ============================================================================

// Hàm format tiền tệ VNĐ
function formatCurrency(amount) {
    return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Hàm format ngày tháng
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Hàm lấy dữ liệu từ LocalStorage
function getLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error);
        return null;
    }
}

// Hàm lưu dữ liệu vào LocalStorage
function setLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error setting ${key} to localStorage:`, error);
        return false;
    }
}

// Hàm kiểm tra và khởi tạo dữ liệu mặc định
function initializeDefaultData() {
    // Khởi tạo types nếu chưa có
    if (!getLocalStorage('types')) {
        const defaultTypes = [
            { id: "Anime", name: "Anime keycap" },
            { id: "Artisan", name: "Artisan keycap" },
            { id: "Pudding", name: "Pudding keycap" },
            { id: "Other", name: "Keycap khác" },
            { id: "All", name: "Xem tất cả...." }
        ];
        setLocalStorage('types', defaultTypes);
    }

    // Khởi tạo users nếu chưa có
    if (!getLocalStorage('user')) {
        const defaultUsers = [
            {
                username: "admin",
                gmail: "admin@gears.com",
                password: "admin123",
                RegisterDay: new Date().toISOString(),
                userType: "admin",
                status: "active"
            }
        ];
        setLocalStorage('user', defaultUsers);
    }

    // Khởi tạo products nếu chưa có
    if (!getLocalStorage('product')) {
        setLocalStorage('product', []);
    }
}

// Hàm tạo ID ngẫu nhiên
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Hàm show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Hàm confirm dialog
function confirmDialog(message) {
    return confirm(message);
}

// Hàm validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Hàm validate số điện thoại Việt Nam
function validatePhone(phone) {
    const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return re.test(phone);
}

// Hàm escape HTML để tránh XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Khởi tạo dữ liệu mặc định khi load trang
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultData();
});

// Export các hàm để sử dụng ở file khác
window.AdminCommon = {
    formatCurrency,
    formatDate,
    getLocalStorage,
    setLocalStorage,
    generateId,
    showToast,
    confirmDialog,
    validateEmail,
    validatePhone,
    escapeHtml,
    initializeDefaultData
};

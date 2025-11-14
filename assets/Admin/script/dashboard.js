// ============================================================================
// DASHBOARD - Trang thống kê tổng quan
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
});

function loadDashboardStats() {
    // Lấy dữ liệu từ localStorage
    const users = getLocalStorage('user') || [];
    const products = getLocalStorage('product') || [];
    const orders = getLocalStorage('orders') || [];

    // Tính toán thống kê
    const totalCustomers = users.filter(u => u.userType !== 'admin').length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    
    // Tính tổng doanh thu (chỉ đơn hàng đã giao)
    const totalRevenue = orders
        .filter(order => order.status === 'giaohang')
        .reduce((sum, order) => sum + (order.total || 0), 0);

    // Hiển thị thống kê
    document.getElementById('total-customers').textContent = totalCustomers;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
}

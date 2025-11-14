# GEARS SHOP - ADMIN PANEL

## Cấu trúc mới của Admin Panel

Admin Panel đã được tái cấu trúc hoàn toàn với các trang riêng biệt:

### 📁 Cấu trúc thư mục

```
assets/Admin/
├── dashboard.html          # Trang chủ - Thống kê tổng quan
├── customers.html          # Quản lý khách hàng (có tìm kiếm + phân trang)
├── products.html           # Quản lý sản phẩm (CRUD đầy đủ)
├── orders.html             # Quản lý đơn hàng
├── css/
│   └── style.css
└── script/
    ├── admin-common.js     # Hàm dùng chung cho tất cả trang
    ├── dashboard.js        # Logic trang chủ
    ├── customers.js        # Logic quản lý khách hàng
    ├── products-admin.js   # Logic quản lý sản phẩm
    └── orders.js           # Logic quản lý đơn hàng
```

---

## 🚀 Tính năng chính

### 1. Dashboard (Trang chủ)
- **URL**: `dashboard.html`
- **Tính năng**:
  - Thống kê tổng số khách hàng
  - Thống kê tổng số sản phẩm
  - Thống kê tổng số đơn hàng
  - Thống kê doanh thu

### 2. Quản lý Khách hàng
- **URL**: `customers.html`
- **Tính năng**:
  - ✅ Hiển thị danh sách khách hàng
  - ✅ Tìm kiếm theo tên hoặc email
  - ✅ Lọc theo loại tài khoản (Admin/Khách hàng)
  - ✅ Lọc theo trạng thái (Hoạt động/Bị khóa)
  - ✅ Phân trang (10 khách hàng/trang)
  - ✅ Reset mật khẩu
  - ✅ Khóa/Mở khóa tài khoản

### 3. Quản lý Sản phẩm
- **URL**: `products.html`
- **Tính năng**:
  - ✅ Hiển thị danh sách sản phẩm
  - ✅ Tìm kiếm sản phẩm theo tên
  - ✅ Lọc theo danh mục
  - ✅ Lọc theo khoảng giá
  - ✅ Phân trang (10 sản phẩm/trang)
  - ✅ **THÊM** sản phẩm mới
  - ✅ **SỬA** thông tin sản phẩm (tên, giá, danh mục, ảnh)
  - ✅ **XÓA** sản phẩm
  - ✅ Quản lý danh mục (Thêm/Sửa/Xóa thể loại)

### 4. Quản lý Đơn hàng
- **URL**: `orders.html`
- **Tính năng**:
  - ✅ Hiển thị danh sách đơn hàng
  - ✅ Lọc theo khoảng thời gian
  - ✅ Lọc theo trạng thái đơn hàng
  - ✅ Tìm kiếm theo tên khách hàng
  - ✅ Phân trang (10 đơn hàng/trang)
  - ✅ Xem chi tiết đơn hàng
  - ✅ Cập nhật trạng thái đơn hàng
  - ✅ Xóa đơn hàng

---

## 🔧 Cách sử dụng

### Truy cập Admin Panel

1. Mở file `dashboard.html` trực tiếp trong trình duyệt
2. **KHÔNG CẦN ĐĂNG NHẬP** - Admin panel đã bỏ kiểm tra JavaScript

### Di chuyển giữa các trang

Sử dụng menu điều hướng ở đầu trang:
- **Trang chủ** → `dashboard.html`
- **Quản lý khách hàng** → `customers.html`
- **Quản lý sản phẩm** → `products.html`
- **Quản lý đơn hàng** → `orders.html`

---

## 📊 Cấu trúc dữ liệu LocalStorage

### 1. User (Khách hàng)
```javascript
{
    username: "string",
    gmail: "string",
    password: "string",
    RegisterDay: "ISO date string",
    userType: "admin" | "client",
    status: "active" | "locked"
}
```

### 2. Product (Sản phẩm)
```javascript
{
    id: number,
    name: "string",
    type: "string",        // Danh mục: Anime, Artisan, Pudding, Other
    price: number,
    img: "string",         // Đường dẫn: /img/Products/{type}/{filename}
    description: "string", // (optional)
    stock: number         // (optional) Số lượng tồn kho
}
```

### 3. Types (Danh mục)
```javascript
{
    id: "string",    // VD: "Anime", "Artisan"
    name: "string"   // VD: "Anime keycap", "Artisan keycap"
}
```

### 4. Orders (Đơn hàng)
```javascript
{
    id: number,
    customerName: "string",
    customerEmail: "string",
    customerPhone: "string",
    address: "string",
    date: "ISO date string",
    status: "moi" | "xuly" | "giaohang" | "huy",
    items: [
        {
            name: "string",
            quantity: number,
            price: number
        }
    ],
    total: number,
    note: "string"
}
```

---

## 🛠️ Các hàm tiện ích (admin-common.js)

Tất cả trang admin đều có thể sử dụng các hàm sau:

```javascript
// Format tiền tệ
formatCurrency(amount)  // → "123.456 ₫"

// Format ngày tháng
formatDate(dateString)  // → "14/11/2025"

// LocalStorage
getLocalStorage(key)    // Lấy dữ liệu
setLocalStorage(key, data)  // Lưu dữ liệu

// Thông báo
showToast(message, type)  // type: 'success' | 'error'

// Xác nhận
confirmDialog(message)    // Hiển thị hộp thoại xác nhận

// Validate
validateEmail(email)      // Kiểm tra email hợp lệ
validatePhone(phone)      // Kiểm tra SĐT Việt Nam

// Bảo mật
escapeHtml(text)         // Tránh XSS attack
```

---

## 🔄 Đồng bộ dữ liệu

### Sản phẩm được đồng bộ hoàn toàn giữa Admin và Client:

- **Admin thêm/sửa/xóa** → Cập nhật ngay vào `localStorage.product`
- **Client hiển thị** → Đọc từ `localStorage.product`
- Cấu trúc dữ liệu GIỐNG NHAU 100%

### Lưu ý quan trọng:

1. **ID sản phẩm**: Tự động tăng dựa trên ID lớn nhất
2. **Ảnh sản phẩm**: Lưu đường dẫn tương đối `/img/Products/{type}/{filename}`
3. **Giá**: Lưu dạng số nguyên (VNĐ)
4. **Danh mục**: Phải tồn tại trong `localStorage.types`

---

## ⚠️ Lỗi thường gặp và cách khắc phục

### 1. Không hiển thị dữ liệu
**Nguyên nhân**: LocalStorage chưa có dữ liệu  
**Giải pháp**: File `admin-common.js` sẽ tự động khởi tạo dữ liệu mặc định

### 2. Upload ảnh không hoạt động
**Nguyên nhân**: LocalStorage không lưu được file  
**Giải pháp**: Hiện tại lưu đường dẫn file. Trong thực tế cần upload lên server

### 3. Phân trang không chính xác
**Nguyên nhân**: Dữ liệu bị lọc  
**Giải pháp**: Nhấn nút "Reset" để xem tất cả

---

## 🎨 Tùy chỉnh

### Thay đổi số item trên mỗi trang:

Mở file JavaScript tương ứng và sửa:
```javascript
const itemsPerPage = 10;  // Đổi thành số bạn muốn
```

### Thêm trường dữ liệu mới:

1. Cập nhật cấu trúc trong `admin-common.js`
2. Thêm cột trong bảng HTML
3. Cập nhật form thêm/sửa

---

## 📝 File cũ

File `index.html` cũ vẫn còn nhưng KHÔNG ĐƯỢC SỬ DỤNG NỮA.  
Toàn bộ chức năng đã được tách ra các trang riêng.

---

## 🚨 Bảo mật

⚠️ **LƯU Ý QUAN TRỌNG**:

1. Admin panel KHÔNG CÓ kiểm tra đăng nhập
2. Không dùng cho production (sản phẩm thật)
3. Nếu cần bảo mật, thêm:
   - Kiểm tra session/cookie
   - Xác thực JWT
   - Backend API thay vì LocalStorage

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console của trình duyệt (F12)
2. LocalStorage trong DevTools
3. Đảm bảo tất cả file JavaScript được load đúng

---

**Phiên bản**: 2.0  
**Ngày cập nhật**: 14/11/2025  
**Tác giả**: GEARS Shop Development Team

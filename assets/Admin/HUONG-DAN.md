# 🎉 HƯỚNG DẪN SỬ DỤNG ADMIN MỚI - GEARS SHOP

## ✅ Đã hoàn thành tất cả yêu cầu:

### 1. ✅ Admin tách riêng - Không check JS
- File `index.html` cũ tự động chuyển hướng sang `dashboard.html`
- **KHÔNG CẦN ĐĂNG NHẬP** - Truy cập trực tiếp vào admin panel

### 2. ✅ Quản lý Khách hàng - Trang riêng với tìm kiếm & phân trang
- File: `customers.html`
- Tìm kiếm theo tên/email
- Lọc theo loại tài khoản & trạng thái
- Phân trang 10 khách hàng/trang
- Reset mật khẩu & Khóa/Mở khóa tài khoản

### 3. ✅ Quản lý Sản phẩm - Trang riêng
- File: `products.html`
- Tìm kiếm & lọc theo danh mục, giá
- Phân trang 10 sản phẩm/trang
- **THÊM** sản phẩm mới
- **SỬA** sản phẩm (tên, giá, danh mục, ảnh)
- **XÓA** sản phẩm
- Quản lý danh mục sản phẩm

### 4. ✅ Thông tin sản phẩm đồng bộ Khách hàng & Admin
- Cùng sử dụng `localStorage.product`
- Cấu trúc dữ liệu nhất quán 100%
- Admin sửa → Client thấy ngay

---

## 🚀 CÁCH SỬ DỤNG

### Bước 1: Mở Admin Panel
```
Mở file: assets/Admin/dashboard.html
```

### Bước 2: Di chuyển giữa các trang
Click vào menu ở đầu trang:
- **Trang chủ** - Thống kê tổng quan
- **Quản lý khách hàng** - Xem, tìm kiếm, khóa tài khoản
- **Quản lý sản phẩm** - CRUD sản phẩm đầy đủ
- **Quản lý đơn hàng** - Xem và cập nhật đơn hàng

---

## 📂 CẤU TRÚC FILE MỚI

```
assets/Admin/
├── 📄 dashboard.html       ← Trang chủ (thống kê)
├── 📄 customers.html       ← Quản lý khách hàng
├── 📄 products.html        ← Quản lý sản phẩm (CRUD)
├── 📄 orders.html          ← Quản lý đơn hàng
├── 📄 index.html           ← Tự động redirect
├── 📄 README.md            ← Tài liệu chi tiết
└── script/
    ├── admin-common.js     ← Hàm dùng chung
    ├── dashboard.js        ← Logic trang chủ
    ├── customers.js        ← Logic khách hàng
    ├── products-admin.js   ← Logic sản phẩm (QUAN TRỌNG!)
    └── orders.js           ← Logic đơn hàng
```

---

## 🔧 TÍNH NĂNG CHÍNH

### Quản lý Sản phẩm (products.html)

#### ➕ Thêm sản phẩm:
1. Click nút **"Thêm sản phẩm"**
2. Nhập tên, giá, chọn danh mục
3. Chọn ảnh (hoặc để mặc định)
4. Click **"Thêm"**

#### ✏️ Sửa sản phẩm:
1. Click nút **"Sửa"** (biểu tượng bút)
2. Cập nhật thông tin
3. Chọn ảnh mới (hoặc giữ nguyên)
4. Click **"Cập nhật"**

#### 🗑️ Xóa sản phẩm:
1. Click nút **"Xóa"** (biểu tượng thùng rác)
2. Xác nhận xóa

#### 🔍 Tìm kiếm & Lọc:
- Tìm theo tên sản phẩm
- Lọc theo danh mục
- Lọc theo khoảng giá
- Click **"Reset"** để xóa bộ lọc

---

## 💾 DỮ LIỆU

### Cấu trúc Sản phẩm (ĐỒNG BỘ Admin & Client):
```javascript
{
    id: 1,                              // ID tự động tăng
    name: "OSU! keycap",                // Tên sản phẩm
    type: "Other",                      // Danh mục
    price: 55000,                       // Giá (VNĐ)
    img: "/img/Products/Other/020.jpg", // Đường dẫn ảnh
    description: "Mô tả...",            // Mô tả (optional)
    stock: 10                           // Tồn kho (optional)
}
```

### LocalStorage Keys:
- `product` - Danh sách sản phẩm
- `types` - Danh mục sản phẩm
- `user` - Danh sách người dùng
- `orders` - Danh sách đơn hàng

---

## 🎯 ĐIỂM KHÁC BIỆT

### So với phiên bản cũ:

| Tính năng | Cũ | Mới |
|-----------|-----|-----|
| Kiểm tra đăng nhập | ✅ Có | ❌ Không |
| Cấu trúc | 1 file | 4 trang riêng |
| Tìm kiếm khách hàng | ❌ Không | ✅ Có |
| Phân trang | ❌ Không | ✅ Có (tất cả trang) |
| Sửa sản phẩm | ⚠️ Hạn chế | ✅ Đầy đủ (tên, giá, ảnh, loại) |
| Đồng bộ dữ liệu | ⚠️ Không rõ | ✅ 100% đồng bộ |

---

## ⚡ QUICK START

```bash
# 1. Mở Admin Panel
Mở file: assets/Admin/dashboard.html

# 2. Thêm sản phẩm
- Vào "Quản lý sản phẩm"
- Click "Thêm sản phẩm"
- Điền thông tin → Lưu

# 3. Sửa sản phẩm  
- Click biểu tượng bút ở sản phẩm cần sửa
- Cập nhật thông tin → Lưu

# 4. Xem khách hàng
- Vào "Quản lý khách hàng"
- Tìm kiếm, lọc, phân trang
```

---

## 🐛 XỬ LÝ LỖI

### Không hiển thị dữ liệu?
→ Mở F12 > Application > Local Storage > Kiểm tra dữ liệu

### Thêm sản phẩm không thành công?
→ Kiểm tra Console (F12) xem lỗi gì

### Ảnh không hiển thị?
→ Đảm bảo đường dẫn ảnh đúng: `/img/Products/{type}/{filename}`

### Phân trang lỗi?
→ Click nút "Reset" để xóa bộ lọc

---

## 📖 TÀI LIỆU

Xem chi tiết: `assets/Admin/README.md`

---

## ⚠️ LƯU Ý

1. **LocalStorage**: Dữ liệu lưu trên trình duyệt, xóa cache = mất dữ liệu
2. **Upload ảnh**: Hiện chỉ lưu đường dẫn, thực tế cần upload lên server
3. **Bảo mật**: Không dùng cho production, chỉ phù hợp demo/test

---

## 📞 SUPPORT

Gặp vấn đề? Kiểm tra:
1. Console (F12) có lỗi gì không
2. LocalStorage có dữ liệu chưa
3. File JavaScript đã load chưa

---

**🎊 Chúc bạn sử dụng thành công!**

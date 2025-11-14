// ============================================================================
// PRODUCTS ADMIN - Quản lý sản phẩm với đầy đủ chức năng CRUD
// ============================================================================

let currentPage = 1;
const itemsPerPage = 10;
let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCategories();
    setupEventListeners();
    setupFormHandlers();
});

// ============================================================================
// LOAD & DISPLAY FUNCTIONS
// ============================================================================

function loadProducts() {
    allProducts = getLocalStorage('product') || [];
    filteredProducts = [...allProducts];
    displayProducts();
}

function loadCategories() {
    const types = getLocalStorage('types') || [];
    const categorySelect = document.getElementById('filter-category');
    const addOptionSelect = document.getElementById('AddOption');
    const editOptionSelect = document.getElementById('AddOptionC');
    const editTypeSelect = document.getElementById('js-edit-Type--id');
    const delTypeSelect = document.getElementById('js-delete-Type--id');

    let optionsHTML = '';
    types.forEach(type => {
        if (type.id !== 'All') {
            optionsHTML += `<option value="${type.id}">${type.name}</option>`;
        }
    });

    if (categorySelect) {
        let filterHTML = '<option value="">Tất cả danh mục</option>';
        types.forEach(type => {
            if (type.id !== 'All') {
                filterHTML += `<option value="${type.id}">${type.name}</option>`;
            }
        });
        categorySelect.innerHTML = filterHTML;
    }

    if (addOptionSelect) addOptionSelect.innerHTML = optionsHTML;
    if (editOptionSelect) editOptionSelect.innerHTML = optionsHTML;
    if (editTypeSelect) editTypeSelect.innerHTML = optionsHTML;
    if (delTypeSelect) delTypeSelect.innerHTML = optionsHTML;
}

function displayProducts() {
    const tableElement = document.getElementById('product-list');
    if (!tableElement) return;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    let tableHTML = `
        <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Hình ảnh</th>
            <th>Sửa</th>
            <th>Xóa</th>
        </tr>
    `;

    if (productsToDisplay.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #999;">
                    Không tìm thấy sản phẩm nào
                </td>
            </tr>
        `;
    } else {
        productsToDisplay.forEach((product, index) => {
            const actualIndex = startIndex + index;
            tableHTML += `
                <tr>
                    <td>${product.id}</td>
                    <td>${escapeHtml(product.name)}</td>
                    <td>
                        <span style="padding: 4px 8px; border-radius: 4px; background: #2196F3; color: white; font-size: 12px;">
                            ${product.type}
                        </span>
                    </td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>
                        <img src="..${product.img}" class="container-img" style="max-width: 80px; max-height: 80px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>
                        <button class="fix" onclick="openEditProductForm(${actualIndex})" 
                            style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                    </td>
                    <td>
                        <button class="delete" onclick="deleteProduct(${actualIndex})" 
                            style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    tableElement.innerHTML = tableHTML;
    updatePaginationInfo(startIndex + 1, endIndex, filteredProducts.length);
    renderPagination(totalPages);
}

// ============================================================================
// PAGINATION FUNCTIONS
// ============================================================================

function renderPagination(totalPages) {
    const paginationElement = document.getElementById('pagination-products');
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
    displayProducts();
}

function updatePaginationInfo(start, end, total) {
    document.getElementById('showing-start').textContent = start;
    document.getElementById('showing-end').textContent = end;
    document.getElementById('total-products').textContent = total;
}

// ============================================================================
// SEARCH & FILTER FUNCTIONS
// ============================================================================

function searchAndFilter() {
    const searchText = document.getElementById('search-product').value.toLowerCase().trim();
    const filterCategory = document.getElementById('filter-category').value;
    const minPrice = parseFloat(document.getElementById('filter-min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('filter-max-price').value) || Infinity;

    filteredProducts = allProducts.filter(product => {
        const matchSearch = !searchText || product.name.toLowerCase().includes(searchText);
        const matchCategory = !filterCategory || product.type === filterCategory;
        const matchPrice = product.price >= minPrice && product.price <= maxPrice;

        return matchSearch && matchCategory && matchPrice;
    });

    currentPage = 1;
    displayProducts();
}

function resetFilters() {
    document.getElementById('search-product').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';
    filteredProducts = [...allProducts];
    currentPage = 1;
    displayProducts();
}

// ============================================================================
// PRODUCT CRUD FUNCTIONS
// ============================================================================

function addProduct() {
    const name = document.getElementById('js-item-name').value.trim();
    const price = parseFloat(document.getElementById('js-item-price').value);
    const type = document.getElementById('AddOption').value;
    const imageFile = document.getElementById('js-item-image').files[0];

    if (!name) {
        showToast('Vui lòng nhập tên sản phẩm!', 'error');
        return;
    }

    if (!price || price <= 0) {
        showToast('Vui lòng nhập giá hợp lệ!', 'error');
        return;
    }

    if (!type) {
        showToast('Vui lòng chọn danh mục!', 'error');
        return;
    }

    const products = getLocalStorage('product') || [];
    
    // Tìm ID lớn nhất
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;

    // Xử lý ảnh
    let imagePath = '/img/UpdatingProduct.png'; // Ảnh mặc định

    if (imageFile) {
        // Trong môi trường thực tế, bạn cần upload ảnh lên server
        // Hiện tại sử dụng ảnh mặc định hoặc path giả
        imagePath = `/img/Products/${type}/${imageFile.name}`;
    }

    const newProduct = {
        id: maxId + 1,
        name: name,
        type: type,
        price: price,
        img: imagePath
    };

    products.push(newProduct);
    setLocalStorage('product', products);
    
    showToast('Thêm sản phẩm thành công!', 'success');
    closeAddProductForm();
    loadProducts();
}

function openEditProductForm(index) {
    const product = filteredProducts[index];
    if (!product) return;

    // Tìm index thực trong allProducts
    const realIndex = allProducts.findIndex(p => p.id === product.id);
    
    document.getElementById('js-change-item-id').value = realIndex;
    document.getElementById('js-change-item-name').value = product.name;
    document.getElementById('js-change-item-price').value = product.price;
    document.getElementById('AddOptionC').value = product.type;
    
    // Hiển thị ảnh hiện tại
    const previewImg = document.getElementById('current-image-preview');
    if (previewImg) {
        previewImg.src = '..' + product.img;
        previewImg.style.display = 'block';
    }

    document.querySelector('.ChangeProduct_Wrap').classList.add('isOpenAP');
}

function updateProduct() {
    const index = parseInt(document.getElementById('js-change-item-id').value);
    const name = document.getElementById('js-change-item-name').value.trim();
    const price = parseFloat(document.getElementById('js-change-item-price').value);
    const type = document.getElementById('AddOptionC').value;
    const imageFile = document.getElementById('js-change-item-image').files[0];

    if (!name) {
        showToast('Vui lòng nhập tên sản phẩm!', 'error');
        return;
    }

    if (!price || price <= 0) {
        showToast('Vui lòng nhập giá hợp lệ!', 'error');
        return;
    }

    const products = getLocalStorage('product') || [];
    
    if (products[index]) {
        products[index].name = name;
        products[index].price = price;
        products[index].type = type;

        // Nếu có ảnh mới thì cập nhật
        if (imageFile) {
            products[index].img = `/img/Products/${type}/${imageFile.name}`;
        }

        setLocalStorage('product', products);
        showToast('Cập nhật sản phẩm thành công!', 'success');
        closeEditProductForm();
        loadProducts();
    }
}

function deleteProduct(index) {
    const product = filteredProducts[index];
    if (!product) return;

    if (!confirmDialog(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
        return;
    }

    const products = getLocalStorage('product') || [];
    const realIndex = products.findIndex(p => p.id === product.id);
    
    if (realIndex !== -1) {
        products.splice(realIndex, 1);
        setLocalStorage('product', products);
        showToast('Xóa sản phẩm thành công!', 'success');
        loadProducts();
    }
}

// ============================================================================
// CATEGORY/TYPE MANAGEMENT
// ============================================================================

function addCategory() {
    const id = document.getElementById('js-Type--id').value.trim();
    const name = document.getElementById('js-Type--name').value.trim();

    if (!id || !name) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    const types = getLocalStorage('types') || [];
    
    // Kiểm tra trùng ID
    if (types.some(t => t.id === id)) {
        showToast('ID thể loại đã tồn tại!', 'error');
        return;
    }

    types.push({ id, name });
    setLocalStorage('types', types);
    
    showToast('Thêm thể loại thành công!', 'success');
    closeAddCategoryForm();
    loadCategories();
}

function updateCategory() {
    const id = document.getElementById('js-edit-Type--id').value;
    const newName = document.getElementById('js-edit-Type--name').value.trim();

    if (!newName) {
        showToast('Vui lòng nhập tên mới!', 'error');
        return;
    }

    const types = getLocalStorage('types') || [];
    const index = types.findIndex(t => t.id === id);

    if (index !== -1) {
        types[index].name = newName;
        setLocalStorage('types', types);
        showToast('Cập nhật thể loại thành công!', 'success');
        closeEditCategoryForm();
        loadCategories();
    }
}

function deleteCategory() {
    const id = document.getElementById('js-delete-Type--id').value;

    if (!confirmDialog('Bạn có chắc chắn muốn xóa thể loại này? Các sản phẩm thuộc thể loại này sẽ không bị xóa.')) {
        return;
    }

    const types = getLocalStorage('types') || [];
    const filteredTypes = types.filter(t => t.id !== id && t.id !== 'All');

    setLocalStorage('types', filteredTypes);
    showToast('Xóa thể loại thành công!', 'success');
    closeDelCategoryForm();
    loadCategories();
}

// ============================================================================
// FORM MANAGEMENT
// ============================================================================

function closeAddProductForm() {
    document.querySelector('.AddProduct_Wrap').classList.remove('isOpenAP');
    document.getElementById('js-item-name').value = '';
    document.getElementById('js-item-price').value = '';
    document.getElementById('js-item-image').value = '';
}

function closeEditProductForm() {
    document.querySelector('.ChangeProduct_Wrap').classList.remove('isOpenAP');
    document.getElementById('js-change-item-image').value = '';
}

function closeAddCategoryForm() {
    document.querySelector('.AddTypeProduct_Wrap').classList.remove('isOpenAP');
    document.getElementById('js-Type--id').value = '';
    document.getElementById('js-Type--name').value = '';
}

function closeEditCategoryForm() {
    document.querySelector('.EditTypeProduct_Wrap').classList.remove('isOpenAP');
    document.getElementById('js-edit-Type--name').value = '';
}

function closeDelCategoryForm() {
    document.querySelector('.DelTypeProduct_Wrap').classList.remove('isOpenAP');
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

function setupEventListeners() {
    // Search & Filter
    const btnSearch = document.getElementById('btn-search-product');
    const btnReset = document.getElementById('btn-reset-filter');
    const searchInput = document.getElementById('search-product');

    if (btnSearch) btnSearch.addEventListener('click', searchAndFilter);
    if (btnReset) btnReset.addEventListener('click', resetFilters);
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchAndFilter();
        });
    }

    // Form open buttons
    const btnAddProduct = document.querySelector('.js-addProduct');
    const btnAddType = document.querySelector('.js-addTypeProduct');
    const btnEditType = document.querySelector('.js-editTypeProduct');
    const btnDelType = document.querySelector('.js-delTypeProduct');

    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', () => {
            document.querySelector('.AddProduct_Wrap').classList.add('isOpenAP');
        });
    }

    if (btnAddType) {
        btnAddType.addEventListener('click', () => {
            document.querySelector('.AddTypeProduct_Wrap').classList.add('isOpenAP');
        });
    }

    if (btnEditType) {
        btnEditType.addEventListener('click', () => {
            document.querySelector('.EditTypeProduct_Wrap').classList.add('isOpenAP');
        });
    }

    if (btnDelType) {
        btnDelType.addEventListener('click', () => {
            document.querySelector('.DelTypeProduct_Wrap').classList.add('isOpenAP');
        });
    }

    // Close buttons
    const closeBtns = [
        { selector: '.js-close-btn', wrapper: '.AddProduct_Wrap' },
        { selector: '.js-close-btn2', wrapper: '.ChangeProduct_Wrap' },
        { selector: '.js-close-btn4', wrapper: '.AddTypeProduct_Wrap' },
        { selector: '.js-close-btn-edit', wrapper: '.EditTypeProduct_Wrap' },
        { selector: '.js-close-btn-del', wrapper: '.DelTypeProduct_Wrap' }
    ];

    closeBtns.forEach(({ selector, wrapper }) => {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.addEventListener('click', () => {
                document.querySelector(wrapper).classList.remove('isOpenAP');
            });
        }
    });
}

function setupFormHandlers() {
    // Add Product
    const btnAddProduct = document.getElementById('js-btn-product');
    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', addProduct);
    }

    // Update Product
    const btnUpdateProduct = document.getElementById('js-btn-change-product');
    if (btnUpdateProduct) {
        btnUpdateProduct.addEventListener('click', updateProduct);
    }

    // Add Category
    const btnAddCategory = document.getElementById('js-btn-product--typpe');
    if (btnAddCategory) {
        btnAddCategory.addEventListener('click', addCategory);
    }

    // Update Category
    const btnUpdateCategory = document.getElementById('js-btn-product--typpe-edit');
    if (btnUpdateCategory) {
        btnUpdateCategory.addEventListener('click', updateCategory);
    }

    // Delete Category
    const btnDeleteCategory = document.getElementById('js-btn-product--typpe-del');
    if (btnDeleteCategory) {
        btnDeleteCategory.addEventListener('click', deleteCategory);
    }
}

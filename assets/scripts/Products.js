// --------------------------------------------------------------------------- //
// create Constructor
function typeConstructor(id, name) {
    this.id = id;
    this.name = name;
}

// --------------------------------------------------------------------------- //
// mảng thể loại
var types = [
    new typeConstructor("Anime", "Anime keycap"),
    new typeConstructor("Artisan", "Artisan keycap"),
    new typeConstructor("Pudding", "Pudding keycap"),
    new typeConstructor("Other", "Keycap khác"),
    new typeConstructor("All", "Xem tất cả...."),
];

// --------------------------------------------------------------------------- //
// đẩy mảng thể loại lên Local Storage
function PushTypetoLocalStorage() {
    // nếu trong local Storage ko có types thì khởi tạo 
    if (localStorage.getItem('types') == null) {
        localStorage.setItem('types', JSON.stringify(types)); // đẩy dữ liệu lên Local Storage
    }
}
PushTypetoLocalStorage();

// --------------------------------------------------------------------------- //
// js animation
function categoryActive() {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    var temp = $$(".category-list--item-link");

    temp.forEach(items => {
        items.onclick = function () {
            $(".category-list--item-link.catagory-Active").classList.remove("catagory-Active")
            this.classList.add('catagory-Active');
        }
    })
}

function paginationActive() {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    var temp = $$(".pagination-item--link");

    temp.forEach(item => {
        item.onclick = function () {
            // cơ chế là khi ấn vào element thì sẽ tự huỷ hết đối tượng element cùng class có chứ class đó
            // rồi sau đó mới add class Active vào cho element được click
            $('.pagination-item--link.paginationActive').classList.remove('paginationActive');
            this.classList.add('paginationActive');
        }
    })
}

// -------------------------------------------------- // 
// tạo thanh danh mục trên pc
function CreateSubMenu() {
    var tempArray = "";
    var typesArray = JSON.parse(localStorage.getItem('types'));
    for (var i = 0; i < typesArray.length; i++) {
        if (typesArray[i].id != 'All') {
            tempArray += `
            <li class="category-list--item js-category-item">
                <a id=${typesArray[i].id} class="category-list--item-link" href="#">${typesArray[i].name}</a>
            </li>
            `;
        } else {
            tempArray += `
            <li class="category-list--item js-category-item">
                <a id=${typesArray[i].id} class="category-list--item-link catagory-Active" href="#">${typesArray[i].name}</a>
            </li>
            `;
        }
    }
    document.querySelector(".category-list").innerHTML = tempArray;
}

// --------------------------------------------------------------------------- //


// -------------------------------------------------- // 
// xử lí phần sản phẩm
var productList = JSON.parse(localStorage.getItem('product'));
var ShowProduct = document.querySelector('#js-product-list');
const NumOfItem = 8; // số lượng sản phẩm trên 1 trang

function InnerProductions(name) {
    var tempArray = '';
    var emptyArray = '';

    // lọc ra các phần tử thoả mãn điều khiện -> trả về một obj chứa các phần tử thoả mãn
    var emptyObject = productList.filter((item) => {
        return item.type == name;
    })

    // --------------------------------------- // 
    // in ra số trang
    for (var i = 0; i < emptyObject.length / NumOfItem; i++) {
        if (i == 0) {
            tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link paginationActive">${i+1}</a>
            </li>
            `
        } else {
            tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link">${i+1}</a>
            </li>
            `
        }
    }
    document.querySelector('#page-num').innerHTML = tempArray;

    // --------------------------------------- // 
    // nếu bé hơn 8 thì lấy luôn chiều dài của obj còn không thì mặc định max là 8 sản phẩm 1 trang
    const numItemPage = emptyObject.length > NumOfItem ? NumOfItem : emptyObject.length; // kiểm tra số lượng phần tử mảng đã lọc

    // --------------------------------------- // 
    // in ra trang đầu tiên khi ấn vào danh mục
    for (var i = 0; i < numItemPage; i++) {
        emptyArray += `
        <div class="col l-3 m-4 c-6">
            <div class="product-item">
                <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
                <div class="product-item-main">
                    <h3 class="product-item--name">${emptyObject[i].name}</h3>
                    <div class="product-item--price_type">
                        <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                        <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
                    </div>
                    <button type="button" class="js-product-detail" onClick="showDetail(\'${emptyObject[i].name}\');">Chi tiết</button>
                    <button type="button" class="js-product" onClick="addCart(\'${emptyObject[i].name}\'); addCartSuccess()">Mua Hàng</button>
                </div>
            </div>
        </div>`;
    }
    ShowProduct.innerHTML = emptyArray;

    // --------------------------------------- // 
    // in ra sản phẩm khi ấn vào số trang bất kì
    document.querySelectorAll(".pagination-item--link").forEach(items => {
        items.addEventListener('click', (item) => {
            var emptyArray = '';
            var values = item.target.id;
            var begin = parseInt(values) * numItemPage;
            var end = (parseInt(values) + 1) * numItemPage;
            for (var i = begin; i < end; i++) {
                if (i == parseInt(emptyObject.length)) break;
                emptyArray += `
                <div class="col l-3 m-4 c-6">
                    <div class="product-item">
                        <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
                        <div class="product-item-main">
                            <h3 class="product-item--name">${emptyObject[i].name}</h3>
                            <div class="product-item--price_type">
                                <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                                <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
                            </div>
                            <button type="button" class="js-product-detail" onClick="showDetail(\'${emptyObject[i].name}\');">Chi tiết</button>
                            <button type="button" class="js-product" onClick="addCart(\'${emptyObject[i].name}\'); addCartSuccess()">Mua Hàng</button>
                        </div>
                    </div>
                </div>
                `
            }
            ShowProduct.innerHTML = emptyArray;
        })
    })
}

// --------------------------------------------------------------------------- //
// function in ra tất cả sản phẩm
function InnerAllProductions() {
    var tempArray = '';
    var emptyArray = '';

    // --------------------------------------- // 
    // in ra số trang
    for (var i = 0; i <= productList.length / NumOfItem; i++) {
        if (i == 0) {
            tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link paginationActive">${i+1}</a>
            </li>
            `
        } else {
            tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link">${i+1}</a>
            </li>
            `
        }
    }
    document.querySelector('#page-num').innerHTML = tempArray;

    // --------------------------------------- // 
    const numItemPage = productList.length > NumOfItem ? NumOfItem : productList.length; // kiểm tra số lượng phần tử mảng đã lọc
    // nếu bé hơn 8 thì lấy luôn chiều dài của obj còn không thì mặc định max là 8 sản phẩm 1 trang

    // --------------------------------------- // 
    // in ra trang đầu tiên khi ấn vào danh mục
    for (var i = 0; i < numItemPage; i++) {
        emptyArray += `
        <div class="col l-3 m-4 c-6">
            <div class="product-item">
                <img class="product-item--img" src="./assets${productList[i].img}" alt="">
                <div class="product-item-main">
                    <h3 class="product-item--name">${productList[i].name}</h3>
                    <div class="product-item--price_type">
                        <span class="product-item--price">${productList[i].price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                        <span class="product-item--type">Loại: ${productList[i].type}</span>
                    </div>
                    <button type="button" class="js-product-detail" onClick="showDetail(\'${productList[i].name}\');">Chi tiết</button>
                    <button type="button" class="js-product" onClick="addCart(\'${productList[i].name}\'); addCartSuccess()">Mua Hàng</button>
                </div>
            </div>
        </div>
        `
    }
    ShowProduct.innerHTML = emptyArray;

    // --------------------------------------- // 
    // in ra tất cả sản phẩm
    document.querySelectorAll(".pagination-item--link").forEach(items => {
        items.addEventListener('click', (item) => {
            var emptyArray = '';
            var values = item.target.id;
            var begin = parseInt(values) * numItemPage;
            var end = (parseInt(values) + 1) * numItemPage;
            for (var i = begin; i < end; i++) {
                if (i == parseInt(productList.length)) break;
                emptyArray += `
                <div class="col l-3 m-4 c-6">
                    <div class="product-item">
                        <img class="product-item--img" src="./assets${productList[i].img}" alt="">
                        <div class="product-item-main">
                            <h3 class="product-item--name">${productList[i].name}</h3>
                            <div class="product-item--price_type">
                                <span class="product-item--price">${productList[i].price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                                <span class="product-item--type">Loại: ${productList[i].type}</span>
                            </div>
                            <button type="button" class="js-product-detail" onClick="showDetail(\'${productList[i].name}\');">Chi tiết</button>
                            <button type="button" class="js-product" onClick="addCart(\'${productList[i].name}\'); addCartSuccess()">Mua Hàng</button>
                        </div>
                    </div>
                </div>
                `
            }
            ShowProduct.innerHTML = emptyArray;
        })
    })
}

// --------------------------------------------------------------------------- //
// in ra sản phẩm khi ấn vào 1 option trong phần danh mục
function ShowProductItem() {
    var ListOPT = document.querySelectorAll(".js-category-item");
    ListOPT.forEach(items => {
        items.addEventListener('click', (item) => {
            var innerID = item.target.id;  
            // in số sản phẩm trong danh mục thông qua số lượng types có trong local storage
            var typesArray = JSON.parse(localStorage.getItem('types'));
            for(var i = 0; i < typesArray.length; i++) {
                if(innerID == typesArray[i].id) {
                    if(typesArray[i].id == 'All') {
                        InnerAllProductions();
                        paginationActive();
                    }else {
                        InnerProductions(innerID);
                        paginationActive();
                    }
                }
            }
        })
    })
}

// --------------------------------------------------------------------------- //
// xử lí tìm kiếm
function InnerProductions_Search(name) {
    var tempArray = '';
    var emptyArray = '';

    // lọc ra các phần tử thoả mãn điều khiện -> trả về một obj chứa các phần tử thoả mãn
    var emptyObject = productList.filter((item) => {
        return item.name.toLowerCase().search(name.toLowerCase()) != -1;
    })

    // --------------------------------------- // 
    // in ra số trang
    for (var i = 0; i < emptyObject.length / NumOfItem; i++) {
        if (i == 0) {
            tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link paginationActive">${i+1}</a>
            </li>
            `
        } else {
            tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link">${i+1}</a>
            </li>
            `
        }
    }
    document.querySelector('#page-num').innerHTML = tempArray;

    // --------------------------------------- // 
    // nếu bé hơn 8 thì lấy luôn chiều dài của obj còn không thì mặc định max là 8 sản phẩm 1 trang
    const numItemPage = emptyObject.length > NumOfItem ? NumOfItem : emptyObject.length; // kiểm tra số lượng phần tử mảng đã lọc

    // --------------------------------------- // 
    // in ra trang đầu tiên khi ấn vào danh mục
    for (var i = 0; i < numItemPage; i++) {
        emptyArray += `
        <div class="col l-3 m-4 c-6">
            <div class="product-item">
                <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
                <div class="product-item-main">
                    <h3 class="product-item--name">${emptyObject[i].name}</h3>
                    <div class="product-item--price_type">
                        <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                        <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
                    </div>
                    <button type="button" class="js-product-detail" onClick="showDetail(\'${emptyObject[i].name}\');">Chi tiết</button>
                    <button type="button" class="js-product" onClick="addCart(\'${emptyObject[i].name}\'); addCartSuccess()">Mua Hàng</button>
                </div>
            </div>
        </div>`;
    }
    ShowProduct.innerHTML = emptyArray;

    // --------------------------------------- // 
    // in ra sản phẩm khi ấn vào số trang bất kì
    document.querySelectorAll(".pagination-item--link").forEach(items => {
        items.addEventListener('click', (item) => {
            var emptyArray = '';
            var values = item.target.id;
            var begin = parseInt(values) * numItemPage;
            var end = (parseInt(values) + 1) * numItemPage;
            for (var i = begin; i < end; i++) {
                if (i == parseInt(emptyObject.length)) break;
                emptyArray += `
                <div class="col l-3 m-4 c-6">
                    <div class="product-item">
                        <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
                        <div class="product-item-main">
                            <h3 class="product-item--name">${emptyObject[i].name}</h3>
                            <div class="product-item--price_type">
                                <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                                <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
                            </div>
                            <button type="button" class="js-product-detail" onClick="showDetail(\'${emptyObject[i].name}\');">Chi tiết</button>
                            <button type="button" class="js-product" onClick="addCart(\'${emptyObject[i].name}\'); addCartSuccess()">Mua Hàng</button>
                        </div>
                    </div>
                </div>
                `
            }
            ShowProduct.innerHTML = emptyArray;
        })
    })
}

// --------------------------------------------------------------------------- //
// PC
// Xử lí thanh tìm kiếm
// function InnerProductBySearch() {
//     const searchInput = document.querySelector('.category-search--input');
//     const searchBtn = document.querySelector('#search-btn');

//     // Bấm nút tìm kiếm
//     if (searchBtn) {
//         searchBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             const keyword = searchInput.value.trim();
//             if (keyword.length > 0) {
//                 InnerProductions_Search(keyword);
//             }
//         });
//     }

//     // Nhấn Enter để tìm kiếm
//     if (searchInput) {
//         searchInput.addEventListener('keydown', (e) => {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 const keyword = searchInput.value.trim();
//                 if (keyword.length > 0) {
//                     InnerProductions_Search(keyword);
//                 }
//             }
//         });
//     }
// }

// // --------------------------------------------------------------------------- //
// // Xử lí tìm kiếm (lọc theo tên hoặc loại)
// function InnerProductions_Search(name) {
//     var tempArray = '';
//     var emptyArray = '';

//     const emptyObject = productList.filter(item => {
//         const text = name.toLowerCase();
//         return item.name.toLowerCase().includes(text) || item.type.toLowerCase().includes(text);
//     });

//     if (emptyObject.length === 0) {
//         ShowProduct.innerHTML = `<p style="text-align:center;width:100%;font-size:18px;">Không tìm thấy sản phẩm nào.</p>`;
//         document.querySelector('#page-num').innerHTML = '';
//         return;
//     }

//     // In số trang
//     for (var i = 0; i < emptyObject.length / NumOfItem; i++) {
//         tempArray += `
//         <li class="pagination-item">
//             <a id="${i}" href="#" class="pagination-item--link ${i === 0 ? 'paginationActive' : ''}">${i + 1}</a>
//         </li>`;
//     }
//     document.querySelector('#page-num').innerHTML = tempArray;

//     const numItemPage = emptyObject.length > NumOfItem ? NumOfItem : emptyObject.length;

//     // In ra sản phẩm trang đầu tiên
//     for (var i = 0; i < numItemPage; i++) {
//         emptyArray += `
//         <div class="col l-3 m-4 c-6">
//             <div class="product-item">
//                 <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
//                 <div class="product-item-main">
//                     <h3 class="product-item--name">${emptyObject[i].name}</h3>
//                     <div class="product-item--price_type">
//                         <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
//                         <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
//                     </div>
//                     <button type="button" class="js-product-detail" onClick="showDetail('${emptyObject[i].name}');">Chi tiết</button>
//                     <button type="button" class="js-product" onClick="addCart('${emptyObject[i].name}'); addCartSuccess()">Mua Hàng</button>
//                 </div>
//             </div>
//         </div>`;
//     }
//     ShowProduct.innerHTML = emptyArray;

//     // Chuyển trang
//     document.querySelectorAll(".pagination-item--link").forEach(items => {
//         items.addEventListener('click', (item) => {
//             var page = parseInt(item.target.id);
//             var start = page * numItemPage;
//             var end = start + numItemPage;
//             var emptyArray = '';

//             for (var i = start; i < end && i < emptyObject.length; i++) {
//                 emptyArray += `
//                 <div class="col l-3 m-4 c-6">
//                     <div class="product-item">
//                         <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
//                         <div class="product-item-main">
//                             <h3 class="product-item--name">${emptyObject[i].name}</h3>
//                             <div class="product-item--price_type">
//                                 <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
//                                 <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
//                             </div>
//                             <button type="button" class="js-product-detail" onClick="showDetail('${emptyObject[i].name}');">Chi tiết</button>
//                             <button type="button" class="js-product" onClick="addCart('${emptyObject[i].name}'); addCartSuccess()">Mua Hàng</button>
//                         </div>
//                     </div>
//                 </div>`;
//             }
//             ShowProduct.innerHTML = emptyArray;
//         });
//     });
// }
// /// ==========================
// // 🔍 TÌM KIẾM NÂNG CAO
// // ==========================

// document.querySelector('#adv-search-btn')?.addEventListener('click', () => {
//   const nameValue = document.querySelector('#adv-name').value.trim().toLowerCase();
//   const categoryValue = document.querySelector('#adv-category').value;
//   const minValue = parseFloat(document.querySelector('#adv-min').value) || 0;
//   const maxValue = parseFloat(document.querySelector('#adv-max').value) || Infinity;

//   // Lọc sản phẩm từ mảng productList
//   const emptyObject = productList.filter(product => {
//     const matchName = product.name.toLowerCase().includes(nameValue);
//     const matchCategory = categoryValue === "" || product.type === categoryValue;
//     const price = parseFloat(product.price);
//     const matchPrice = price >= minValue && price <= maxValue;
//     return matchName && matchCategory && matchPrice;
//   });

//   // Hiển thị nếu không có kết quả
//   if (emptyObject.length === 0) {
//     ShowProduct.innerHTML = `<p style="text-align:center;width:100%;font-size:18px;">Không tìm thấy sản phẩm phù hợp.</p>`;
//     document.querySelector('#page-num').innerHTML = '';
//     return;
//   }

//   // In số trang
//   let tempArray = '';
//   for (var i = 0; i < emptyObject.length / NumOfItem; i++) {
//     tempArray += `
//       <li class="pagination-item">
//           <a id="${i}" href="#" class="pagination-item--link ${i === 0 ? 'paginationActive' : ''}">${i + 1}</a>
//       </li>`;
//   }
//   document.querySelector('#page-num').innerHTML = tempArray;

//   const numItemPage = emptyObject.length > NumOfItem ? NumOfItem : emptyObject.length;

//   // In sản phẩm trang đầu
//   let emptyArray = '';
//   for (var i = 0; i < numItemPage; i++) {
//     emptyArray += `
//       <div class="col l-3 m-4 c-6">
//         <div class="product-item">
//           <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
//           <div class="product-item-main">
//             <h3 class="product-item--name">${emptyObject[i].name}</h3>
//             <div class="product-item--price_type">
//               <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
//               <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
//             </div>
//             <button type="button" class="js-product-detail" onClick="showDetail('${emptyObject[i].name}');">Chi tiết</button>
//             <button type="button" class="js-product" onClick="addCart('${emptyObject[i].name}'); addCartSuccess()">Mua Hàng</button>
//           </div>
//         </div>
//       </div>`;
//   }
//   ShowProduct.innerHTML = emptyArray;

//   // Chuyển trang
//   document.querySelectorAll(".pagination-item--link").forEach(items => {
//     items.addEventListener('click', (item) => {
//       var page = parseInt(item.target.id);
//       var start = page * numItemPage;
//       var end = start + numItemPage;
//       var emptyArray = '';

//       for (var i = start; i < end && i < emptyObject.length; i++) {
//         emptyArray += `
//           <div class="col l-3 m-4 c-6">
//             <div class="product-item">
//               <img class="product-item--img" src="./assets${emptyObject[i].img}" alt="">
//               <div class="product-item-main">
//                 <h3 class="product-item--name">${emptyObject[i].name}</h3>
//                 <div class="product-item--price_type">
//                   <span class="product-item--price">${emptyObject[i].price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
//                   <span class="product-item--type">Loại: ${emptyObject[i].type}</span>
//                 </div>
//                 <button type="button" class="js-product-detail" onClick="showDetail('${emptyObject[i].name}');">Chi tiết</button>
//                 <button type="button" class="js-product" onClick="addCart('${emptyObject[i].name}'); addCartSuccess()">Mua Hàng</button>
//               </div>
//             </div>
//           </div>`;
//       }
//       ShowProduct.innerHTML = emptyArray;
//     });
//   });
// });


// --------------------------------------------------------------------------- //
// Stub functions để tránh lỗi ReferenceError
function InnerProductBySearch() {
  // Tạm thời để trống - tìm kiếm sẽ không hoạt động
}

function showDetail(productName) {
  // Chuyển hướng đến popup tĩnh
  window.location.hash = '#product-detail-demo';
}

function HandleEventDetailProduct() {
  // Hàm giả - không cần xử lý vì dùng popup tĩnh
}

CreateSubMenu();

ShowProductItem();
InnerAllProductions();
paginationActive();
categoryActive();
InnerProductBySearch();
HandleEventDetailProduct();

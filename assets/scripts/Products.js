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
  if (localStorage.getItem("types") == null) {
    localStorage.setItem("types", JSON.stringify(types)); // đẩy dữ liệu lên Local Storage
  }
}
PushTypetoLocalStorage();

// --------------------------------------------------------------------------- //
// js animation
function categoryActive() {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  var temp = $$(".category-list--item-link");

  temp.forEach((items) => {
    items.onclick = function () {
      $(".category-list--item-link.catagory-Active").classList.remove(
        "catagory-Active"
      );
      this.classList.add("catagory-Active");
    };
  });
}

function paginationActive() {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  var temp = $$(".pagination-item--link");

  temp.forEach((item) => {
    item.onclick = function () {
      // cơ chế là khi ấn vào element thì sẽ tự huỷ hết đối tượng element cùng class có chứ class đó
      // rồi sau đó mới add class Active vào cho element được click
      $(".pagination-item--link.paginationActive").classList.remove(
        "paginationActive"
      );
      this.classList.add("paginationActive");
    };
  });
}

// -------------------------------------------------- //
// tạo thanh danh mục trên pc
function CreateSubMenu() {
  var tempArray = "";
  var typesArray = JSON.parse(localStorage.getItem("types"));
  for (var i = 0; i < typesArray.length; i++) {
    if (typesArray[i].id != "All") {
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
var productList = JSON.parse(localStorage.getItem("product"));
var ShowProduct = document.querySelector("#js-product-list");
const NumOfItem = 8; // số lượng sản phẩm trên 1 trang

function InnerProductions(name) {
  var tempArray = "";
  var emptyArray = "";

  // lọc ra các phần tử thoả mãn điều khiện -> trả về một obj chứa các phần tử thoả mãn
  var emptyObject = productList.filter((item) => {
    return item.type == name;
  });

  // --------------------------------------- //
  // in ra số trang
  for (var i = 0; i < emptyObject.length / NumOfItem; i++) {
    if (i == 0) {
      tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link paginationActive">${
        i + 1
      }</a>
            </li>
            `;
    } else {
      tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link">${i + 1}</a>
            </li>
            `;
    }
  }
  document.querySelector("#page-num").innerHTML = tempArray;

  // --------------------------------------- //
  // nếu bé hơn 8 thì lấy luôn chiều dài của obj còn không thì mặc định max là 8 sản phẩm 1 trang
  const numItemPage =
    emptyObject.length > NumOfItem ? NumOfItem : emptyObject.length; // kiểm tra số lượng phần tử mảng đã lọc

  // --------------------------------------- //
  // in ra trang đầu tiên khi ấn vào danh mục
  for (var i = 0; i < numItemPage; i++) {
    emptyArray += `
        <div class="col l-3 m-4 c-6">
            <div class="product-item">
                <img class="product-item--img" src="./assets${
                  emptyObject[i].img
                }" alt="">
                <div class="product-item-main">
                    <h3 class="product-item--name">${emptyObject[i].name}</h3>
                    <div class="product-item--price_type">
                        <span class="product-item--price">${emptyObject[
                          i
                        ].price.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}</span>
                        <span class="product-item--type">Loại: ${
                          emptyObject[i].type
                        }</span>
                    </div>
                    <button type="button" class="js-product-detail" onClick="showDetail('${
                      emptyObject[i].name
                    }');">Chi tiết</button>
                    <button type="button" class="js-product" onClick="addCart('${
                      emptyObject[i].name
                    }')">Mua Hàng</button>
                </div>
            </div>
        </div>`;
  }
  ShowProduct.innerHTML = emptyArray;

  // --------------------------------------- //
  // in ra sản phẩm khi ấn vào số trang bất kì
  document.querySelectorAll(".pagination-item--link").forEach((items) => {
    items.addEventListener("click", (item) => {
      var emptyArray = "";
      var values = item.target.id;
      var begin = parseInt(values) * numItemPage;
      var end = (parseInt(values) + 1) * numItemPage;
      for (var i = begin; i < end; i++) {
        if (i == parseInt(emptyObject.length)) break;
        emptyArray += `
                <div class="col l-3 m-4 c-6">
                    <div class="product-item">
                        <img class="product-item--img" src="./assets${
                          emptyObject[i].img
                        }" alt="">
                        <div class="product-item-main">
                            <h3 class="product-item--name">${
                              emptyObject[i].name
                            }</h3>
                            <div class="product-item--price_type">
                                <span class="product-item--price">${emptyObject[
                                  i
                                ].price.toLocaleString("vi", {
                                  style: "currency",
                                  currency: "VND",
                                })}</span>
                                <span class="product-item--type">Loại: ${
                                  emptyObject[i].type
                                }</span>
                            </div>
                            <button type="button" class="js-product-detail" onClick="showDetail('${
                              emptyObject[i].name
                            }');">Chi tiết</button>
                            <button type="button" class="js-product" onClick="addCart('${
                              emptyObject[i].name
                            }')">Mua Hàng</button>
                        </div>
                    </div>
                </div>
                `;
      }
      ShowProduct.innerHTML = emptyArray;
    });
  });
}

// --------------------------------------------------------------------------- //
// function in ra tất cả sản phẩm
function InnerAllProductions() {
  var tempArray = "";
  var emptyArray = "";

  // --------------------------------------- //
  // in ra số trang
  for (var i = 0; i <= productList.length / NumOfItem; i++) {
    if (i == 0) {
      tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link paginationActive">${
        i + 1
      }</a>
            </li>
            `;
    } else {
      tempArray += `
            <li class="pagination-item">
                <a id="${i}" href="#" class="pagination-item--link">${i + 1}</a>
            </li>
            `;
    }
  }
  document.querySelector("#page-num").innerHTML = tempArray;

  // --------------------------------------- //
  const numItemPage =
    productList.length > NumOfItem ? NumOfItem : productList.length; // kiểm tra số lượng phần tử mảng đã lọc
  // nếu bé hơn 8 thì lấy luôn chiều dài của obj còn không thì mặc định max là 8 sản phẩm 1 trang

  // --------------------------------------- //
  // in ra trang đầu tiên khi ấn vào danh mục
  for (var i = 0; i < numItemPage; i++) {
    emptyArray += `
        <div class="col l-3 m-4 c-6">
            <div class="product-item">
                <img class="product-item--img" src="./assets${
                  productList[i].img
                }" alt="">
                <div class="product-item-main">
                    <h3 class="product-item--name">${productList[i].name}</h3>
                    <div class="product-item--price_type">
                        <span class="product-item--price">${productList[
                          i
                        ].price.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}</span>
                        <span class="product-item--type">Loại: ${
                          productList[i].type
                        }</span>
                    </div>
                    <button type="button" class="js-product-detail" onClick="showDetail('${
                      productList[i].name
                    }');">Chi tiết</button>
                    <button type="button" class="js-product" onClick="addCart('${
                      productList[i].name
                    }')">Mua Hàng</button>
                </div>
            </div>
        </div>
        `;
  }
  ShowProduct.innerHTML = emptyArray;

  // --------------------------------------- //
  // in ra tất cả sản phẩm
  document.querySelectorAll(".pagination-item--link").forEach((items) => {
    items.addEventListener("click", (item) => {
      var emptyArray = "";
      var values = item.target.id;
      var begin = parseInt(values) * numItemPage;
      var end = (parseInt(values) + 1) * numItemPage;
      for (var i = begin; i < end; i++) {
        if (i == parseInt(productList.length)) break;
        emptyArray += `
                <div class="col l-3 m-4 c-6">
                    <div class="product-item">
                        <img class="product-item--img" src="./assets${
                          productList[i].img
                        }" alt="">
                        <div class="product-item-main">
                            <h3 class="product-item--name">${
                              productList[i].name
                            }</h3>
                            <div class="product-item--price_type">
                                <span class="product-item--price">${productList[
                                  i
                                ].price.toLocaleString("vi", {
                                  style: "currency",
                                  currency: "VND",
                                })}</span>
                                <span class="product-item--type">Loại: ${
                                  productList[i].type
                                }</span>
                            </div>
                            <button type="button" class="js-product-detail" onClick="showDetail('${
                              productList[i].name
                            }');">Chi tiết</button>
                            <button type="button" class="js-product" onClick="addCart('${
                              productList[i].name
                            }')">Mua Hàng</button>
                        </div>
                    </div>
                </div>
                `;
      }
      ShowProduct.innerHTML = emptyArray;
    });
  });
}

// --------------------------------------------------------------------------- //
// in ra sản phẩm khi ấn vào 1 option trong phần danh mục
// --------------------------------------------------------------------------- //
// Xử lý tìm kiếm sản phẩm - Chuyển hướng đến danh mục Anime Keycap
// --------------------------------------------------------------------------- //
// Xử lý tìm kiếm sản phẩm - Chuyển hướng đến danh mục Anime Keycap
// --------------------------------------------------------------------------- //
// Xử lý tìm kiếm sản phẩm - Chuyển hướng đến danh mục Anime Keycap
function handleSearch() {
  console.log("handleSearch initialized"); // Debug

  // Hàm xử lý tìm kiếm chính
  function performSearch() {
    console.log("Search performed"); // Debug

    // THAY VÌ CHUYỂN TAB, SẼ RELOAD TRANG VỚI PARAM
    const url = new URL(window.location.href);
    url.searchParams.set("category", "Anime");
    window.location.href = url.toString();
  }

  // Gắn sự kiện cho nút tìm kiếm desktop
  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      performSearch();
      return false;
    });
  }

  // Gắn sự kiếm cho nút tìm kiếm mobile
  const searchBtnMobile = document.getElementById("search-btn--mobile");
  if (searchBtnMobile) {
    searchBtnMobile.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      performSearch();
      return false;
    });
  }

  // Gắn sự kiện cho nút tìm kiếm nâng cao
  const advSearchBtn = document.getElementById("adv-search-btn");
  if (advSearchBtn) {
    advSearchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      performSearch();
      return false;
    });
  }

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const searchInputs = document.querySelectorAll(
    ".category-search--input, .mobile-search--input"
  );
  searchInputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        performSearch();
        return false;
      }
    });
  });
}

// THÊM HÀM MỚI ĐỂ XỬ LÝ KHI TRANG LOAD
function handlePageLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  if (category === "Anime") {
    // Chuyển đến tab Sản phẩm
    const headerItems = document.querySelectorAll(".js-TabHeader");
    const containerItems = document.querySelectorAll(".js-Container");
    const line = document.querySelector(".header-navbar--list .line");

    if (headerItems.length > 1 && containerItems.length > 1) {
      // Xóa class active cũ
      document
        .querySelector(".js-TabHeader.headerActive")
        ?.classList.remove("headerActive");
      document
        .querySelector(".js-Container.headerActive")
        ?.classList.remove("headerActive");

      // Thêm class active mới
      headerItems[1].classList.add("headerActive");
      containerItems[1].classList.add("headerActive");

      // Cập nhật line
      if (line) {
        line.style.width = headerItems[1].offsetWidth + "px";
        line.style.left = headerItems[1].offsetLeft + "px";
      }
    }

    // Chọn danh mục Anime
    setTimeout(() => {
      const animeCategory = document.getElementById("Anime");
      if (animeCategory) {
        console.log("Auto-selecting Anime category on page load");

        // Xóa class active cũ
        document
          .querySelector(".category-list--item-link.catagory-Active")
          ?.classList.remove("catagory-Active");

        // Thêm class active mới
        animeCategory.classList.add("catagory-Active");

        // Hiển thị sản phẩm Anime
        if (typeof InnerProductions === "function") {
          InnerProductions("Anime");
        }
        if (typeof paginationActive === "function") {
          paginationActive();
        }
      }
    }, 100);
  }
}

// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(handleSearch, 500);
  handlePageLoad(); // THÊM DÒNG NÀY
});
function ShowProductItem() {
  var ListOPT = document.querySelectorAll(".js-category-item");
  ListOPT.forEach((items) => {
    items.addEventListener("click", (item) => {
      var innerID = item.target.id;
      var productList = JSON.parse(localStorage.getItem("product")); // Đọc lại productList
      var ShowProduct = document.querySelector("#js-product-list");
      var emptyObject = [];
      var emptyArray = "";

      // Lọc sản phẩm
      if (innerID == "All") {
        InnerAllProductions();
        paginationActive();
        return;
      } else {
        for (var i = 0; i < productList.length; i++) {
          if (productList[i].type == innerID) {
            emptyObject.push(productList[i]);
          }
        }
      }

      // Xử lý phân trang cho danh mục được chọn
      var tempArray = "";
      var maxPage = Math.ceil(emptyObject.length / NumOfItem);

      for (var i = 0; i < maxPage; i++) {
        if (i == 0) {
          tempArray += `
                    <li class="pagination-item">
                        <a id="${i}" href="#" class="pagination-item--link paginationActive">${
            i + 1
          }</a>
                    </li>
                    `;
        } else {
          tempArray += `
                    <li class="pagination-item">
                        <a id="${i}" href="#" class="pagination-item--link">${
            i + 1
          }</a>
                    </li>
                    `;
        }
      }
      document.querySelector("#page-num").innerHTML = tempArray;

      // Hiển thị trang đầu tiên
      const numItemPage =
        emptyObject.length > NumOfItem ? NumOfItem : emptyObject.length;
      for (var i = 0; i < numItemPage; i++) {
        emptyArray += `
                <div class="col l-3 m-4 c-6">
                    <div class="product-item">
                        <img class="product-item--img" src="./assets${
                          emptyObject[i].img
                        }" alt="">
                        <div class="product-item-main">
                            <h3 class="product-item--name">${
                              emptyObject[i].name
                            }</h3>
                            <div class="product-item--price_type">
                                <span class="product-item--price">${emptyObject[
                                  i
                                ].price.toLocaleString("vi", {
                                  style: "currency",
                                  currency: "VND",
                                })}</span>
                                <span class="product-item--type">Loại: ${
                                  emptyObject[i].type
                                }</span>
                            </div>
                            <button type="button" class="js-product-detail" onClick="showDetail('${
                              emptyObject[i].name
                            }');">Chi tiết</button>
                            <button type="button" class="js-product" onClick="addCart('${
                              emptyObject[i].name
                            }')">Mua Hàng</button>
                        </div>
                    </div>
                </div>
                `;
      }

      ShowProduct.innerHTML = emptyArray;

      // Cập nhật lại event cho phân trang mới
      document
        .querySelectorAll(".pagination-item--link")
        .forEach((pageItem) => {
          pageItem.addEventListener("click", (e) => {
            var innerPageArray = "";
            var values = e.target.id;
            var begin = parseInt(values) * NumOfItem;
            var end = (parseInt(values) + 1) * NumOfItem;
            for (var i = begin; i < end; i++) {
              if (i == parseInt(emptyObject.length)) break;
              innerPageArray += `
                        <div class="col l-3 m-4 c-6">
                            <div class="product-item">
                                <img class="product-item--img" src="./assets${
                                  emptyObject[i].img
                                }" alt="">
                                <div class="product-item-main">
                                    <h3 class="product-item--name">${
                                      emptyObject[i].name
                                    }</h3>
                                    <div class="product-item--price_type">
                                        <span class="product-item--price">${emptyObject[
                                          i
                                        ].price.toLocaleString("vi", {
                                          style: "currency",
                                          currency: "VND",
                                        })}</span>
                                        <span class="product-item--type">Loại: ${
                                          emptyObject[i].type
                                        }</span>
                                    </div>
                                    <button type="button" class="js-product-detail" onClick="showDetail('${
                                      emptyObject[i].name
                                    }');">Chi tiết</button>
                                    <button type="button" class="js-product" onClick="addCart('${
                                      emptyObject[i].name
                                    }')">Mua Hàng</button>
                                </div>
                            </div>
                        </div>
                        `;
            }
            ShowProduct.innerHTML = innerPageArray;

            // Cập nhật trạng thái active
            document
              .querySelector(".pagination-item--link.paginationActive")
              ?.classList.remove("paginationActive");
            e.target.classList.add("paginationActive");
          });
        });

      // Xử lý khi không có sản phẩm
      if (emptyObject.length === 0) {
        ShowProduct.innerHTML =
          '<p style="text-align: center; width: 100%; margin: 20px 0; font-size: 1.2rem; color: #888;">Hiện tại không có sản phẩm nào thuộc loại này.</p>';
        document.querySelector("#page-num").innerHTML = "";
      }
    });
  });
}

// --------------------------------------------------------------------------- //
// Stub functions để tránh lỗi ReferenceError
function InnerProductBySearch() {
  // Tạm thời để trống - tìm kiếm sẽ không hoạt động
}

function showDetail(productName) {
  console.log("Opening product detail for:", productName);

  // Hiển thị popup chi tiết sản phẩm
  const popup = document.querySelector(".product-detail-popup");
  if (popup) {
    popup.style.display = "flex";

    // Thêm sự kiện đóng popup khi click ra ngoài
    popup.onclick = function (e) {
      if (e.target === popup) {
        popup.style.display = "none";
      }
    };

    // Thêm sự kiện đóng khi click nút close
    const closeBtn = popup.querySelector(".product-detail-close");
    if (closeBtn) {
      closeBtn.onclick = function (e) {
        e.preventDefault();
        popup.style.display = "none";
      };
    }
  } else {
    console.error("Product detail popup not found!");
  }
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

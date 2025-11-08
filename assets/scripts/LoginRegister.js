// --------------------------------------------------------------------------- //
// Xử lí form đăng kí
function register() {
  var btnRegister = document.querySelector("#js-btn-register");
  btnRegister.addEventListener("click", () => {
    var today = new Date();
    var userArray = JSON.parse(localStorage.getItem("user"));
    var gmail = document.getElementById("js-RG_gmail");
    var username = document.getElementById("js-RG_account");
    var password = document.getElementById("js-RG_password");
    var REpassword = document.querySelector("#js-RG_RePassword");
    var RadioOption = document.querySelector("#js-RG_radio");
    var RegisterDay =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();

    // var checkAcc = userArray.some((item) => {
    //   return item.username == username.value;
    // });

    // var checkGmail = userArray.some((item) => {
    //   return item.gmail == gmail.value;
    // });

    // if (checkGmail) {
    //   alert(
    //     "Đã có có người sử dụng gmail này để đăng kí !\n Vui lòng sử dụng gmail khác !"
    //   );
    // } else if (checkAcc) {
    //   alert("Đã có người sử dụng tên đăng nhập này rồi !");
    // } else {
    //   // sử dụng Regular Expressions kiểm tra email có hợp lệ hay không
    //   var filter =
    //     /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //   if (!filter.test(gmail.value)) {
    //     alert("Địa chỉ Email không hợp lệ.\nVí dụ: Example@gmail.com");
    //     gmail.focus;
    //     return false;
    //   }

    //   if (gmail.value.length == 0) {
    //     alert("gmail ko được để trống !");
    //     gmail.focus();
    //     return false;
    //   }

    //   if (username.value.length == 0) {
    //     alert("Tên người dùng ko được để trống !");
    //     username.focus();
    //     return false;
    //   }

    //   if (password.value.length == 0) {
    //     alert("Mật khẩu ko được để trống !");
    //     password.focus();
    //     return false;
    //   }

    //   if (REpassword.value != password.value) {
    //     alert("Mật khẩu và mật khẩu xác nhận phải giống nhau !");
    //     REpassword.focus();
    //     return false;
    //   }

    //   if (!RadioOption.checked) {
    //     alert("Bạn phải xác nhận chấp nhận điều khoảng của chúng tôi !");
    //     return false;
    //   }

    //   var user = {
    //     username: username.value,
    //     password: password.value,
    //     gmail: gmail.value,
    //     RegisterDay: RegisterDay,
    //     userType: "user",
    //     status: "active",
    //   };
    //   userArray.push(user);
    //   localStorage.setItem("user", JSON.stringify(userArray));
    //   alert("Đăng kí tài khoản thành công !\n Chúc bạn mua sắm vui vẻ");

    //   // đóng form lẫn reset value trong form input
    //   document.querySelector(".LR-wrap").classList.remove("isOpenLR");
    //   gmail.value = "";
    //   username.value = "";
    //   password.value = "";
    //   REpassword.value = "";
    //   RadioOption.checked = false;
    // }
  });
}

// --------------------------------------------------------------------------- //
// xử lí sự kiện logout của user
function Handle_LogOut() {
  // Tìm nút logout bằng class js-logout
  var logout = document.querySelector(".js-logout");
  
  if (!logout) {
    console.error("Không tìm thấy nút logout");
    return;
  }

  logout.onclick = (e) => {
    e.preventDefault();
    // Xóa currentUser khỏi localStorage
    localStorage.removeItem("currentUser");
    // Reload lại trang để về trạng thái chưa đăng nhập
    window.location.reload();
  };
}

// --------------------------------------------------------------------------- //
// xử lí sự kiện logout của admin
function Handle_LogOutAdmin() {
  var isLogin = document.querySelector(".js-isLogin");
  var logout = document.querySelector(".header-navbar-logout");
  var header = document.querySelector(".header");
  var container = document.querySelector(".container");
  var temp = document.querySelector(".js-isLogin > a");

  isLogin.addEventListener("click", () => {
    logout.classList.add("is-Logout");
    event.stopPropagation();
  });

  logout.onclick = () => {
    window.location.reload(); // sau khi ấn nút thoát thì load lại trang
  };

  // click ra ngoài form logout thì ẩn button logout
  header.addEventListener("click", () => {
    logout.classList.remove("is-Logout");
  });

  container.addEventListener("click", () => {
    logout.classList.remove("is-Logout"); //
  });

  // ngăn sự kiện mở button logOut khi ấn vào biểu tượng Admin
  // vì biểu tượng admin chỉ dùng để mở vào trang quản trị (performance UI)
  temp.addEventListener("click", () => {
    event.stopPropagation();
  });
}

// --------------------------------------------------------------------------- //
// xử lí form login
function login() {
  var btnLogin = document.querySelector("#js-btn-login");
  btnLogin.addEventListener("click", () => {
    var username = document.getElementById("js-LG_account");
    var password = document.getElementById("js-LG_password");
    var userArray = JSON.parse(localStorage.getItem("user"));

    if (username.value.length === 0) {
      alert("vui lòng nhập tên tài khoản !");
      username.focus();
      return false;
    }

    if (password.value.length === 0) {
      alert("vui lòng nhập mật khẩu !");
      password.focus();
      return false;
    }

    // kiểm tra tài khoản có tồn tại trong Local Storage hay không
    var checkAcc = userArray.some((item) => {
      return item.username == username.value;
    });

    if (!checkAcc) {
      alert("Tên tài khoản không tồn tại !");
    } else {
      for (i = 0; i < userArray.length; i++) {
        // nếu người đăng nhập là Admin
        if (
          userArray[i].username == username.value &&
          userArray[i].password == password.value &&
          userArray[i].userType === "admin"
        ) {
          // Lưu thông tin admin đang đăng nhập vào localStorage
          localStorage.setItem("currentUser", username.value);
          
          // Xóa class is-relatived để tránh layout shift
          document.querySelector(".js-HandlerLR").classList.remove("is-relatived");
          
          document.querySelector(".js-HandlerLR").innerHTML = `
                            <a href="./assets/Admin/index.html" target="_blank" class="header-navbar-profile">
                                <i class="fas fa-user-cog"></i>
                                Admin
                            </a>
                    `;
          
          // Thêm nút Đăng xuất vào navbar list (không phải trong js-HandlerLR)
          const logoutBtn = document.createElement('div');
          logoutBtn.className = 'header-navbar--item';
          logoutBtn.innerHTML = `
              <a href="#" class="header-navbar-logout js-logout">
                  <i class="fas fa-sign-out-alt"></i>
                  Đăng xuất
              </a>
          `;
          document.querySelector(".js-HandlerLR").parentElement.insertBefore(
              logoutBtn, 
              document.querySelector(".line")
          );
          
          document.querySelector(".js-HandlerLR").classList.add("js-isLogin"); // thêm class is_Login
          document.getElementById("LR-form").remove();
          // CẬP NHẬT: Sử dụng hàm mới để hiển thị giỏ hàng và lịch sử đơn hàng
          updateCartDisplayAfterLogin();
          // Event logout sẽ được xử lý bởi event delegation ở cuối file
          break;
        } else {
          // nếu người đăng nhập là user
          // kiểm tra mật khẩu đăng nhập
          if (
            userArray[i].username == username.value &&
            userArray[i].password != password.value
          ) {
            alert("Sai mật khẩu !");
            break;
          }
          if (userArray[i].status === "lock") {
            alert("Tài khoản đã bị khóa !");
            break;
          }
          if (
            userArray[i].username == username.value &&
            userArray[i].password == password.value
          ) {
            // Lưu thông tin user đang đăng nhập vào localStorage
            localStorage.setItem("currentUser", username.value);
            
            // Xóa class is-relatived để tránh layout shift
            document.querySelector(".js-HandlerLR").classList.remove("is-relatived");
            
            document.querySelector(".js-HandlerLR").innerHTML = `
                                <a href="#profile-info" class="header-navbar-profile">
                                    <i class="far fa-id-card"></i>
                                    Hồ sơ
                                </a>
                        `;
            
            // Thêm nút Đăng xuất vào navbar list (không phải trong js-HandlerLR)
            const logoutBtn = document.createElement('div');
            logoutBtn.className = 'header-navbar--item';
            logoutBtn.innerHTML = `
                <a href="#" class="header-navbar-logout js-logout">
                    <i class="fas fa-sign-out-alt"></i>
                    Đăng xuất
                </a>
            `;
            document.querySelector(".js-HandlerLR").parentElement.insertBefore(
                logoutBtn, 
                document.querySelector(".line")
            );
            
            document.querySelector(".js-HandlerLR").classList.add("js-isLogin"); // thêm class is_Login
            document.getElementById("LR-form").remove(); // xoá form Login/Register sau khi đăng nhập thành công
            
            // Load thông tin user vào profile popup
            loadUserProfileData();
            
            // CẬP NHẬT: Sử dụng hàm mới để hiển thị giỏ hàng và lịch sử đơn hàng
            updateCartDisplayAfterLogin();
            // Event logout sẽ được xử lý bởi event delegation ở cuối file
            break;
          }
        }
      }
    }
  });
}

// -----------------------------------------------------------------
// form sẽ hiện ra sau khi đăng nhập thành công
function showListCart() {
  var nameUser = document.getElementById("js-Username").innerText;
  var showPayment = JSON.parse(localStorage.getItem("cartList"));
  var temp = "";
  for (var i = 0; i < showPayment.length; i++) {
    if (showPayment[i].username == nameUser) {
      if (showPayment[i].status == "confirmed") {
        value = "Đã xác nhận";
        color = "green";
      }

      if (showPayment[i].status == "pending") {
        value = "Đang xử lí";
        color = "orange";
      }

      if (showPayment[i].status == "unconfirmed") {
        value = "Đã huỷ";
        color = "red";
      }

      temp += `
            <tr>
                <td style="width: 5%">${i + 1}</td>
                <td style="width: 55%">${showPayment[i].ListNameProducts.join(
                  "</br>"
                )}</td>
                <td style="width: 20%">${showPayment[
                  i
                ].totalMoney.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}</td>
                <td id="js-cart-status" style="width: 20%; color: ${color}">${value}</td>
            </tr>
            `;
    }
  }

  document.querySelector(".container__Mycart-listItem").innerHTML = `
        <table id="listProduct">
        <tr>
            <th>STT</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
        </tr>
        ${temp}
        </table>
    `;
}
// --------------------------------------------------------------------------- //
// function hiển thị giỏ hàng trống
function formPayment() {
  document.querySelector(".cartPayment").innerHTML = `
    <div class="container__cart-title">Đơn Hàng hiện tại</div>
    <div class="container__Mycart-wrap">
        <ul class="container__Mycart-listItem">
            <div class="container_Mycart-Temp">
                Hiện tại bạn chưa đặt đơn hàng nào cả :(
            </div>
        </ul>
    </div>`;
}

// -----------------------------------------------------------------
// Load thông tin user vào profile popup
function loadUserProfileData() {
  const currentUsername = localStorage.getItem("currentUser");
  if (!currentUsername) return;
  
  const userArray = JSON.parse(localStorage.getItem("user"));
  const currentUser = userArray.find(u => u.username === currentUsername);
  
  if (!currentUser) return;
  
  // Hiển thị thông tin trong tab "Thông tin"
  document.getElementById("profile-display-username").textContent = currentUser.username || "N/A";
  document.getElementById("profile-display-username2").textContent = currentUser.username || "N/A";
  document.getElementById("profile-display-fullname").textContent = currentUser.fullname || "Chưa cập nhật";
  document.getElementById("profile-display-email").textContent = currentUser.gmail || "N/A";
  document.getElementById("profile-display-email2").textContent = currentUser.gmail || "N/A";
  document.getElementById("profile-display-phone").textContent = currentUser.phone || "Chưa cập nhật";
  document.getElementById("profile-display-address").textContent = currentUser.address || "Chưa cập nhật";
  document.getElementById("profile-display-registerday").textContent = currentUser.RegisterDay || "N/A";
  
  // Cập nhật avatar initials
  const initials = currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : "U";
  document.getElementById("profile-avatar-initials").textContent = initials;
  
  // Load dữ liệu vào form "Chỉnh sửa"
  document.getElementById("profile-edit-fullname").value = currentUser.fullname || "";
  document.getElementById("profile-edit-phone").value = currentUser.phone || "";
  document.getElementById("profile-edit-address").value = currentUser.address || "";
  
  // Load lịch sử đơn hàng
  loadUserOrders(currentUsername);
}

// Load lịch sử đơn hàng của user
function loadUserOrders(username) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const userOrders = orders.filter(order => order.username === username);
  
  const orderList = document.getElementById("profile-order-list");
  
  if (userOrders.length === 0) {
    orderList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #999;">
        <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p>Bạn chưa có đơn hàng nào</p>
      </div>
    `;
    return;
  }
  
  let html = "";
  userOrders.reverse().forEach((order, index) => {
    const statusColor = order.status === "Đã giao" ? "#10b981" : 
                       order.status === "Đang giao" ? "#3b82f6" : "#f59e0b";
    
    html += `
      <div class="order-history-item">
        <div class="order-history-header">
          <span class="order-number">Đơn hàng #${userOrders.length - index}</span>
          <span class="order-date">${order.date || "N/A"}</span>
        </div>
        <div class="order-history-body">
          <div class="order-products">
            ${order.products ? order.products.map(p => `<p>• ${p.name} x${p.quantity}</p>`).join('') : '<p>Không có thông tin sản phẩm</p>'}
          </div>
          <div class="order-total">${order.total ? order.total.toLocaleString('vi-VN') : '0'}đ</div>
          <div class="order-status" style="background-color: ${statusColor};">
            ${order.status || "Đang xử lý"}
          </div>
        </div>
      </div>
    `;
  });
  
  orderList.innerHTML = html;
}

// Lưu thông tin profile đã chỉnh sửa - ĐÃ VÔ HIỆU HÓA (chỉ dùng HTML tĩnh)
// function saveProfileData() {
//   const currentUsername = localStorage.getItem("currentUser");
//   if (!currentUsername) return;
//   
//   const userArray = JSON.parse(localStorage.getItem("user"));
//   const userIndex = userArray.findIndex(u => u.username === currentUsername);
//   
//   if (userIndex === -1) return;
//   
//   // Cập nhật thông tin
//   userArray[userIndex].fullname = document.getElementById("profile-edit-fullname").value;
//   userArray[userIndex].phone = document.getElementById("profile-edit-phone").value;
//   userArray[userIndex].address = document.getElementById("profile-edit-address").value;
//   
//   // Lưu lại vào localStorage
//   localStorage.setItem("user", JSON.stringify(userArray));
//   
//   // Reload lại dữ liệu hiển thị
//   loadUserProfileData();
//   
//   // Hiển thị popup thành công
//   window.location.hash = "#profile-save-success";
//   
//   // Tự động đóng sau 2 giây
//   setTimeout(() => {
//     window.location.hash = "#profile-info";
//   }, 2000);
// }

// Nút Lưu thông tin đã bị vô hiệu hóa (chỉ dùng HTML tĩnh)
// document.addEventListener("DOMContentLoaded", () => {
//   const saveBtn = document.getElementById("profile-save-btn");
//   if (saveBtn) {
//     saveBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       saveProfileData();
//     });
//   }
// });

// -----------------------------------------------------------------
// Event delegation cho nút logout (hoạt động cho cả user và admin)
document.addEventListener("click", function(e) {
  // Kiểm tra nếu click vào nút logout hoặc phần tử con của nó
  const logoutBtn = e.target.closest(".js-logout");
  if (logoutBtn) {
    e.preventDefault();
    console.log("Logout clicked!"); // Debug
    localStorage.removeItem("currentUser");
    window.location.reload();
  }
});

// -----------------------------------------------------------------
// Stub function để tránh lỗi
function updateCartDisplayAfterLogin() {
  // Không làm gì - giỏ hàng đã được pre-populate bằng HTML tĩnh
}

login();
register();

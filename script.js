// ================= LOAD CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= WISHLIST =================
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// ================= ADD TO WISHLIST =================
function toggleWishlist(btn, productName) {

  let exists = wishlist.includes(productName);

  if (exists) {

    wishlist = wishlist.filter(item => item !== productName);

    btn.classList.remove("active-wishlist");

    showToast(`${productName} removed from wishlist 💔`);

  } else {

    wishlist.push(productName);

    btn.classList.add("active-wishlist");

    showToast(`${productName} added to wishlist ❤️`);
  }

  saveWishlist();
}

// ================= LOAD ACTIVE WISHLIST =================
function loadWishlistButtons() {

  let wishlistBtns = document.querySelectorAll(".wishlist-btn");

  wishlistBtns.forEach(btn => {

    let productName = btn.getAttribute("data-product");

    if (wishlist.includes(productName)) {
      btn.classList.add("active-wishlist");
    }
  });
}

// ================= ADD TO CART =================
function buyNow(product, price) {

  price = Number(price);

  if (!product || isNaN(price)) return;

  let existing = cart.find(
    item => item.name.toLowerCase() === product.toLowerCase()
  );

  // PRODUCT IMAGE
  let productCard = event.target.closest(".product");

  let image = "";

  if (productCard) {

    let imgTag = productCard.querySelector("img");

    if (imgTag) {
      image = imgTag.src;
    }
  }

  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      id: Date.now(),
      name: product,
      price: price,
      image: image,
      qty: 1
    });
  }

  saveCart();

  updateCartCount();

  showToast(`${product} added to cart 🛒`);
}

// ================= UPDATE CART COUNT =================
function updateCartCount() {

  let count = cart.reduce((sum, item) => {
    return sum + item.qty;
  }, 0);

  let cartBox = document.querySelector(".cart-box a");

  if (cartBox) {
    cartBox.innerText = `🛒 Cart (${count})`;
  }
}

// ================= REMOVE ITEM =================
function removeFromCart(index) {

  if (index < 0 || index >= cart.length) return;

  cart.splice(index, 1);

  saveCart();

  updateCartCount();

  renderCart();

  showToast("Item removed ❌");
}

// ================= CLEAR CART =================
function clearCart() {

  if (confirm("Clear entire cart?")) {

    cart = [];

    saveCart();

    updateCartCount();

    renderCart();

    showToast("Cart cleared 🗑️");
  }
}

// ================= CHANGE QUANTITY =================
function changeQty(index, type) {

  if (!cart[index]) return;

  if (type === "inc") {

    cart[index].qty++;

  } else if (type === "dec") {

    if (cart[index].qty > 1) {

      cart[index].qty--;

    } else {

      removeFromCart(index);
      return;
    }
  }

  saveCart();

  updateCartCount();

  renderCart();
}

// ================= GET CART =================
function getCart() {
  return cart;
}

// ================= RENDER CART =================
function renderCart() {

  let container = document.getElementById("cart-items");

  let totalBox = document.getElementById("total");

  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  // EMPTY CART
  if (cart.length === 0) {

    container.innerHTML = `

      <div class="empty-cart">

        <img 
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          width="120"
        >

        <h2>Your cart is empty 🛒</h2>

        <p>Add products to continue shopping</p>

        <a href="shop.html" class="shop-btn">
          Continue Shopping
        </a>

      </div>
    `;

    if (totalBox) {
      totalBox.innerHTML = "";
    }

    return;
  }

  // CART ITEMS
  cart.forEach((item, index) => {

    let itemTotal = item.price * item.qty;

    total += itemTotal;

    let div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `

      <div class="cart-left">

        <img 
          src="${item.image || 'https://via.placeholder.com/100'}"
          class="cart-img"
        >

      </div>

      <div class="cart-info">

        <h3>${item.name}</h3>

        <p class="cart-price">
          ₹${item.price}
        </p>

        <div class="cart-actions">

          <button class="qty-btn"
            onclick="changeQty(${index}, 'dec')">
            −
          </button>

          <span class="qty-number">
            ${item.qty}
          </span>

          <button class="qty-btn"
            onclick="changeQty(${index}, 'inc')">
            +
          </button>

        </div>

      </div>

      <div class="cart-right">

        <h4>
          ₹${itemTotal}
        </h4>

        <button class="remove-btn"
          onclick="removeFromCart(${index})">
          Remove
        </button>

      </div>

    `;

    container.appendChild(div);
  });

  // TOTAL BOX
  if (totalBox) {

    totalBox.innerHTML = `

      <div class="total-card">

        <h2>Total: ₹${total}</h2>

        <button class="checkout-btn">
          Proceed To Checkout
        </button>

      </div>

    `;
  }
}

// ================= SLIDER =================
let sliderInterval;

let currentSlide = 0;

// SHOW SLIDE
function showSlide(index) {

  let slides = document.querySelectorAll(".slide");

  let dots = document.querySelectorAll(".dot");

  if (!slides.length) return;

  slides.forEach(slide => {
    slide.classList.remove("active");
  });

  dots.forEach(dot => {
    dot.classList.remove("active-dot");
  });

  currentSlide =
    (index + slides.length) % slides.length;

  slides[currentSlide].classList.add("active");

  if (dots[currentSlide]) {
    dots[currentSlide].classList.add("active-dot");
  }
}

// AUTO SLIDER
function startSlider() {

  let slides = document.querySelectorAll(".slide");

  if (!slides.length) return;

  showSlide(0);

  if (sliderInterval) {
    clearInterval(sliderInterval);
  }

  sliderInterval = setInterval(() => {

    showSlide(currentSlide + 1);

  }, 4000);
}

// NEXT
function nextSlide() {
  showSlide(currentSlide + 1);
}

// PREVIOUS
function prevSlide() {
  showSlide(currentSlide - 1);
}

// DOT CONTROL
function currentSlideControl(index) {
  showSlide(index);
}

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {

  let sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    sidebar.classList.toggle("active");
  }
}

// ================= CATEGORY TOGGLE =================
function toggleCategories() {

  let categoryBox =
    document.querySelector(".sidebar-categories");

  if (categoryBox) {
    categoryBox.classList.toggle("active");
  }
}

// ================= SEARCH PRODUCTS =================
function searchProducts() {

  let input = document.getElementById("searchInput");

  if (!input) return;

  let filter = input.value.toLowerCase();

  let products = document.querySelectorAll(".product");

  products.forEach(product => {

    let title = product.querySelector("h3");

    if (!title) return;

    let text = title.innerText.toLowerCase();

    if (text.includes(filter)) {

      product.style.display = "block";

    } else {

      product.style.display = "none";
    }
  });
}

// ================= CATEGORY FILTER =================
function filterProducts(category, button) {

  let products = document.querySelectorAll(".product");

  products.forEach(product => {

    let productCategory =
      product.getAttribute("data-category");

    if (
      category === "all" ||
      productCategory === category
    ) {

      product.style.display = "block";

    } else {

      product.style.display = "none";
    }
  });

  // ACTIVE BUTTON
  let buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(btn => {
    btn.classList.remove("active-filter");
  });

  if (button) {
    button.classList.add("active-filter");
  }
}

// ================= PRODUCT QUICK VIEW =================
function quickView(name, price, image) {

  let modal = document.getElementById("quickViewModal");

  let modalContent = document.getElementById("quickViewContent");

  if (!modal || !modalContent) return;

  modal.style.display = "flex";

  modalContent.innerHTML = `

    <div class="quick-view-box">

      <span class="close-modal"
        onclick="closeQuickView()">
        ✖
      </span>

      <img src="${image}" class="quick-view-img">

      <div class="quick-view-info">

        <h2>${name}</h2>

        <div class="quick-rating">
          ⭐⭐⭐⭐⭐ (4.9)
        </div>

        <p class="quick-price">
          ₹${price}
        </p>

        <p class="quick-desc">
          Premium beauty product with natural ingredients
          for healthy glowing skin.
        </p>

        <button 
          class="quick-cart-btn"
          onclick="buyNow('${name}', ${price})">
          Add To Cart
        </button>

      </div>

    </div>
  `;
}

// CLOSE QUICK VIEW
function closeQuickView() {

  let modal = document.getElementById("quickViewModal");

  if (modal) {
    modal.style.display = "none";
  }
}

// ================= TOAST =================
let currentToast = null;

function showToast(message) {

  if (currentToast) {
    currentToast.remove();
  }

  let toast = document.createElement("div");

  toast.className = "toast";

  toast.innerText = message;

  document.body.appendChild(toast);

  currentToast = toast;

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {

      toast.remove();

      currentToast = null;

    }, 300);

  }, 2200);
}

// ================= CLOSE SIDEBAR =================
document.addEventListener("click", function (e) {

  let sidebar = document.querySelector(".sidebar");

  let menuBtn = document.querySelector(".menu-btn");

  if (!sidebar || !menuBtn) return;

  if (
    !sidebar.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {

    sidebar.classList.remove("active");
  }
});

// ================= SEARCH EVENT =================
document.addEventListener("DOMContentLoaded", () => {

  let searchInput =
    document.getElementById("searchInput");

  if (searchInput) {

    searchInput.addEventListener(
      "keyup",
      searchProducts
    );
  }
});

// ================= CLOSE MODAL OUTSIDE CLICK =================
window.addEventListener("click", function(e) {

  let modal = document.getElementById("quickViewModal");

  if (e.target === modal) {
    closeQuickView();
  }
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  renderCart();

  startSlider();

  loadWishlistButtons();
});

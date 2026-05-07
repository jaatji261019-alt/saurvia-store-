// ================= LOAD CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= ADD TO CART =================
function buyNow(product, price) {

  price = Number(price);

  if (!product || isNaN(price)) return;

  let existing = cart.find(
    item => item.name.toLowerCase() === product.toLowerCase()
  );

  if (existing) {
    existing.qty++;
  } else {

    cart.push({
      id: Date.now(),
      name: product,
      price: price,
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
        <h2>Your cart is empty 🛒</h2>
        <p>Add products to continue shopping</p>
      </div>
    `;

    if (totalBox) {
      totalBox.innerText = "";
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

      <div class="cart-info">

        <h3>${item.name}</h3>

        <p>
          ₹${item.price} × ${item.qty}
        </p>

        <h4>
          ₹${itemTotal}
        </h4>

      </div>

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

        <button class="remove-btn"
          onclick="removeFromCart(${index})">
          Remove
        </button>

      </div>

    `;

    container.appendChild(div);
  });

  // TOTAL
  if (totalBox) {

    totalBox.innerHTML = `
      <h2>Total: ₹${total}</h2>
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

  currentSlide = (index + slides.length) % slides.length;

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

// NEXT SLIDE
function nextSlide() {
  showSlide(currentSlide + 1);
}

// PREVIOUS SLIDE
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

  let categoryBox = document.querySelector(".sidebar-categories");

  if (categoryBox) {
    categoryBox.classList.toggle("active");
  }
}

// ================= SEARCH FILTER =================
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
function filterProducts(category) {

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

  event.target.classList.add("active-filter");
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

// ================= SEARCH INPUT EVENT =================
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

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  renderCart();

  startSlider();
});

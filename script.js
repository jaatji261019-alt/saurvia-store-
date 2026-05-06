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

// ================= CART COUNT =================
function updateCartCount() {
  let count = cart.reduce((sum, item) => sum + item.qty, 0);

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
}

// ================= CLEAR CART =================
function clearCart() {
  if (confirm("Clear entire cart?")) {
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
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

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty 🛒</p>";
    if (totalBox) totalBox.innerText = "";
    return;
  }

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;

    let div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        ₹${item.price} × ${item.qty} = ₹${itemTotal}
      </div>

      <div>
        <button onclick="changeQty(${index}, 'dec')">-</button>
        <button onclick="changeQty(${index}, 'inc')">+</button>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;

    container.appendChild(div);
  });

  if (totalBox) {
    totalBox.innerText = "Total: ₹" + total;
  }
}

// ================= SLIDER =================
let sliderInterval;
let currentSlide = 0;

function showSlide(index) {
  let slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  slides.forEach(s => s.classList.remove("active"));

  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

function startSlider() {
  let slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  showSlide(0);

  if (sliderInterval) clearInterval(sliderInterval);

  sliderInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4000);
}

// 🔥 MANUAL CONTROL (ARROWS)
function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
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
  let catBox = document.querySelector(".sidebar-categories");
  if (catBox) {
    catBox.classList.toggle("active");
  }
}

// ================= TOAST =================
let currentToast = null;

function showToast(message) {
  if (currentToast) currentToast.remove();

  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);
  currentToast = toast;

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
    currentToast = null;
  }, 2000);
}

// ================= CLOSE SIDEBAR =================
document.addEventListener("click", function (e) {
  let sidebar = document.querySelector(".sidebar");
  let menuBtn = document.querySelector(".menu-btn");

  if (!sidebar || !menuBtn) return;

  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  startSlider();
});

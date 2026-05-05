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
    existing.qty += 1;
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
  showToast(product + " added to cart 🛒");
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

// ================= AUTO SLIDER =================
function startSlider() {
  let slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let index = 0;

  slides.forEach((s, i) => {
    s.classList.remove("active");
    if (i === 0) s.classList.add("active");
  });

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 4000);
}

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
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

// ================= TOAST MESSAGE =================
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ================= CLOSE SIDEBAR ON OUTSIDE CLICK =================
document.addEventListener("click", function (e) {
  let sidebar = document.getElementById("sidebar");
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

// ================= LOAD CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= ADD TO CART =================
function buyNow(product, price) {
  price = Number(price);

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

  alert(product + " added to cart 🛒");
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

  // First slide ensure active
  slides.forEach(s => s.classList.remove("active"));
  slides[0].classList.add("active");

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3000);
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  startSlider();
});

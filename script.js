let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= ADD TO CART ================= */
function buyNow(product, price) {
  let item = {
    name: product,
    price: price,
    id: Date.now()
  };

  cart.push(item);
  saveCart();

  alert(product + " added to cart 🛒");

  updateCartCount();
}

/* ================= SAVE CART ================= */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= CART COUNT ================= */
function updateCartCount() {
  let count = cart.length;

  // If cart icon exists
  let cartBox = document.querySelector(".cart-box a");
  if (cartBox) {
    cartBox.innerText = `🛒 Cart (${count})`;
  }

  console.log("Cart Items:", count);
}

/* ================= REMOVE ITEM ================= */
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();

  // refresh cart page if exists
  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* ================= GET CART ================= */
function getCart() {
  return cart;
}

/* ================= CLEAR CART ================= */
function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();

  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* ================= CART RENDER (FOR cart.html) ================= */
function renderCart() {
  let container = document.getElementById("cart-items");
  let totalBox = document.getElementById("total");

  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    container.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - ₹${item.price}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  if (totalBox) {
    totalBox.innerText = "Total: ₹" + total;
  }
}

/* ================= INIT ================= */
updateCartCount();

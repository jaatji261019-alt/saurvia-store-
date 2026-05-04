let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART / BUY NOW
function buyNow(product, price) {
  let item = {
    name: product,
    price: price
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(product + " added to cart 🛒");

  updateCartCount();
}

// OPTIONAL: CART COUNT (agar tu icon use kare)
function updateCartCount() {
  console.log("Cart Items:", cart.length);
}

// REMOVE ITEM (cart page ke liye)
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// GET CART ITEMS (cart page use karega)
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// CLEAR CART (checkout ke baad use ho sakta hai)
function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

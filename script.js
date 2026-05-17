/* =========================================================
   SAURVIA MAIN SCRIPT
========================================================= */

/* ================= LOAD STORAGE ================= */

let cart =
  JSON.parse(
    localStorage.getItem("cart")
  ) || [];

let wishlist =
  JSON.parse(
    localStorage.getItem("wishlist")
  ) || [];

/* ================= SAVE FUNCTIONS ================= */

function saveCart() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}

function saveWishlist() {

  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );
}

/* ================= UPDATE CART COUNT ================= */

function updateCartCount() {

  let count = 0;

  cart.forEach(item => {

    count += item.qty || 1;

  });

  let cartLinks =
    document.querySelectorAll(
      ".cart-count, .cart-box a"
    );

  cartLinks.forEach(link => {

    link.innerHTML =
      `🛒 Cart (${count})`;

  });
}

/* ================= TOAST ================= */

let currentToast = null;

function showToast(message) {

  if(currentToast){

    currentToast.remove();

  }

  let toast =
    document.createElement("div");

  toast.className = "toast";

  toast.innerText = message;

  document.body.appendChild(toast);

  currentToast = toast;

  setTimeout(() => {

    toast.classList.add("show");

  },100);

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {

      if(toast){

        toast.remove();

      }

      currentToast = null;

    },300);

  },2200);
}

/* ================= SIDEBAR ================= */

function toggleSidebar() {

  let sidebar =
    document.getElementById("sidebar");

  if(sidebar){

    sidebar.classList.toggle("active");

  }
}

/* ================= CATEGORY TOGGLE ================= */

function toggleCategories() {

  let menu =
    document.getElementById("catMenu");

  if(menu){

    menu.classList.toggle("active");

  }
}

/* ================= ADD TO CART ================= */

function buyNow(
  product,
  price,
  image = ""
) {

  price = Number(price);

  let existing =
    cart.find(item =>
      item.name.toLowerCase() ===
      product.toLowerCase()
    );

  /* AUTO IMAGE */
  if(
    !image &&
    typeof event !== "undefined"
  ){

    let card =
      event.target.closest(
        ".product-card, .product, .wishlist-card"
      );

    if(card){

      let img =
        card.querySelector("img");

      if(img){

        image = img.src;

      }
    }
  }

  if(existing){

    existing.qty += 1;

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

  showToast(
    `${product} added to cart 🛒`
  );
}

/* ================= REMOVE FROM CART ================= */

function removeFromCart(index) {

  cart.splice(index,1);

  saveCart();

  updateCartCount();

  renderCart();

  showToast(
    "Item removed ❌"
  );
}

/* ================= CHANGE QUANTITY ================= */

function changeQty(index,type) {

  if(!cart[index]) return;

  if(type === "inc"){

    cart[index].qty++;

  } else {

    if(cart[index].qty > 1){

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

/* ================= CLEAR CART ================= */

function clearCart() {

  if(
    confirm(
      "Clear entire cart?"
    )
  ){

    cart = [];

    saveCart();

    updateCartCount();

    renderCart();

    showToast(
      "Cart cleared 🗑️"
    );
  }
}

/* ================= RENDER CART ================= */

function renderCart() {

  let container =
    document.getElementById(
      "cart-items"
    );

  let totalBox =
    document.getElementById(
      "total"
    );

  if(!container) return;

  container.innerHTML = "";

  let total = 0;

  /* EMPTY CART */

  if(cart.length === 0){

    container.innerHTML = `

      <div class="empty-cart">

        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          width="120"
        >

        <h2>
          Your cart is empty 🛒
        </h2>

        <p>
          Add products to continue shopping
        </p>

        <a
          href="shop.html"
          class="shop-btn"
        >
          Continue Shopping
        </a>

      </div>

    `;

    if(totalBox){

      totalBox.innerHTML = "";

    }

    return;
  }

  /* CART ITEMS */

  cart.forEach((item,index) => {

    let qty =
      item.qty || 1;

    let itemTotal =
      item.price * qty;

    total += itemTotal;

    let div =
      document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `

      <div class="cart-left">

        <img
          src="${
            item.image ||
            "https://via.placeholder.com/100"
          }"
          class="cart-img"
        >

      </div>

      <div class="cart-info">

        <h3>
          ${item.name}
        </h3>

        <p class="cart-price">
          ₹${item.price}
        </p>

        <div class="cart-actions">

          <button
            class="qty-btn"
            onclick="changeQty(${index},'dec')"
          >
            −
          </button>

          <span class="qty-number">
            ${qty}
          </span>

          <button
            class="qty-btn"
            onclick="changeQty(${index},'inc')"
          >
            +
          </button>

        </div>

      </div>

      <div class="cart-right">

        <h4>
          ₹${itemTotal}
        </h4>

        <button
          class="remove-btn"
          onclick="removeFromCart(${index})"
        >
          Remove
        </button>

      </div>

    `;

    container.appendChild(div);

  });

  /* TOTAL */

  if(totalBox){

    totalBox.innerHTML = `

      <div class="total-card">

        <div class="summary-row">

          <span>
            Subtotal
          </span>

          <span>
            ₹${total}
          </span>

        </div>

        <div class="summary-row">

          <span>
            Delivery
          </span>

          <span style="color:green;">
            FREE
          </span>

        </div>

        <div class="summary-total">

          <span>
            Total
          </span>

          <span>
            ₹${total}
          </span>

        </div>

        <button
          class="checkout-btn"
          onclick="goToCheckout()"
        >
          Proceed To Checkout
        </button>

        <button
          class="clear-cart-btn"
          onclick="clearCart()"
        >
          Clear Cart
        </button>

      </div>

    `;
  }
}

/* ================= GO TO CHECKOUT ================= */

function goToCheckout() {

  if(cart.length === 0){

    showToast(
      "Your cart is empty 🛒"
    );

    return;
  }

  window.location.href =
    "checkout.html";
}

/* ================= TOGGLE WISHLIST ================= */

function toggleWishlist(
  btn,
  productName,
  price = 0,
  image = ""
) {

  let exists =
    wishlist.find(item =>
      item.name === productName
    );

  let icon =
    btn.querySelector("i");

  if(exists){

    wishlist =
      wishlist.filter(item =>
        item.name !== productName
      );

    btn.classList.remove(
      "active-wishlist"
    );

    if(icon){

      icon.className =
        "fa-regular fa-heart";
    }

    showToast(
      `${productName} removed 💔`
    );

  } else {

    /* AUTO IMAGE */

    if(
      !image &&
      typeof event !== "undefined"
    ){

      let card =
        event.target.closest(
          ".product-card, .product"
        );

      if(card){

        let img =
          card.querySelector("img");

        if(img){

          image = img.src;

        }
      }
    }

    wishlist.push({

      id: Date.now(),

      name: productName,

      price: price,

      image: image

    });

    btn.classList.add(
      "active-wishlist"
    );

    if(icon){

      icon.className =
        "fa-solid fa-heart";
    }

    showToast(
      `${productName} added ❤️`
    );
  }

  saveWishlist();

  loadWishlistButtons();
}

/* ================= LOAD ACTIVE WISHLIST ================= */

function loadWishlistButtons() {

  let buttons =
    document.querySelectorAll(
      ".wishlist-btn, .wishlist-product-btn"
    );

  buttons.forEach(btn => {

    let product =

      btn.getAttribute(
        "data-product"
      ) ||

      btn.getAttribute(
        "data-name"
      );

    if(!product) return;

    let exists =
      wishlist.find(item =>
        item.name === product
      );

    let icon =
      btn.querySelector("i");

    if(exists){

      btn.classList.add(
        "active-wishlist"
      );

      if(icon){

        icon.className =
          "fa-solid fa-heart";
      }

    } else {

      btn.classList.remove(
        "active-wishlist"
      );

      if(icon){

        icon.className =
          "fa-regular fa-heart";
      }
    }
  });
}

/* ================= RENDER WISHLIST ================= */

function renderWishlist() {

  let container =

    document.getElementById(
      "wishlistContainer"
    ) ||

    document.getElementById(
      "wishlist-items"
    );

  if(!container) return;

  container.innerHTML = "";

  /* EMPTY */

  if(wishlist.length === 0){

    container.innerHTML = `

      <div class="empty-cart">

        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
          width="120"
        >

        <h2>
          Wishlist is empty ❤️
        </h2>

        <a
          href="shop.html"
          class="shop-btn"
        >
          Continue Shopping
        </a>

      </div>

    `;

    return;
  }

  /* ITEMS */

  wishlist.forEach((item,index) => {

    let div =
      document.createElement("div");

    div.className =
      "wishlist-card";

    div.innerHTML = `

      <div class="wishlist-image">

        <img
          src="${
            item.image ||
            "https://via.placeholder.com/200"
          }"
        >

      </div>

      <div class="wishlist-info">

        <h3>
          ${item.name}
        </h3>

        <p class="wishlist-price">
          ₹${item.price}
        </p>

        <div class="wishlist-rating">
          ⭐⭐⭐⭐⭐ (4.9)
        </div>

        <div class="wishlist-buttons">

          <button
            class="wishlist-cart-btn"
            onclick="moveToCart(${index})"
          >
            Add To Cart
          </button>

          <button
            class="wishlist-remove-btn"
            onclick="removeFromWishlist(${index})"
          >
            Remove
          </button>

        </div>

      </div>

    `;

    container.appendChild(div);

  });
}

/* ================= REMOVE WISHLIST ================= */

function removeFromWishlist(index) {

  wishlist.splice(index,1);

  saveWishlist();

  renderWishlist();

  loadWishlistButtons();

  showToast(
    "Removed from wishlist ❌"
  );
}

/* ================= MOVE TO CART ================= */

function moveToCart(index) {

  let item =
    wishlist[index];

  if(!item) return;

  buyNow(
    item.name,
    item.price,
    item.image
  );

  wishlist.splice(index,1);

  saveWishlist();

  renderWishlist();

  loadWishlistButtons();

  showToast(
    "Moved to cart 🛒"
  );
}

/* ================= SEARCH PRODUCTS ================= */

function searchProducts() {

  let input =
    document.getElementById(
      "searchInput"
    );

  if(!input) return;

  let filter =
    input.value.toLowerCase();

  let products =
    document.querySelectorAll(
      ".product-card, .product"
    );

  let found = false;

  products.forEach(product => {

    let title =
      product.querySelector("h3");

    if(!title) return;

    let text =
      title.innerText.toLowerCase();

    if(
      text.includes(filter)
    ){

      product.style.display =
        "block";

      found = true;

    } else {

      product.style.display =
        "none";
    }

  });

  let noProducts =
    document.getElementById(
      "noProducts"
    );

  if(noProducts){

    noProducts.style.display =
      found ? "none" : "block";
  }
}

/* ================= FILTER PRODUCTS ================= */

function filterProducts(category) {

  let products =
    document.querySelectorAll(
      ".product-card"
    );

  let found = false;

  products.forEach(product => {

    let productCategory =
      product.dataset.category;

    if(
      category === "all" ||
      productCategory === category
    ){

      product.style.display =
        "block";

      found = true;

    } else {

      product.style.display =
        "none";
    }
  });

  let noProducts =
    document.getElementById(
      "noProducts"
    );

  if(noProducts){

    noProducts.style.display =
      found ? "none" : "block";
  }
}

/* ================= SLIDER ================= */

let currentSlide = 0;

function showSlide(index) {

  let slides =
    document.querySelectorAll(
      ".slide"
    );

  if(!slides.length) return;

  slides.forEach(slide => {

    slide.classList.remove(
      "active"
    );

  });

  currentSlide =
    (index + slides.length) %
    slides.length;

  slides[currentSlide]
    .classList.add("active");
}

function nextSlide() {

  showSlide(currentSlide + 1);
}

function prevSlide() {

  showSlide(currentSlide - 1);
}

/* ================= AUTO SLIDER ================= */

if(
  document.querySelectorAll(".slide")
    .length > 0
){

  setInterval(() => {

    nextSlide();

  },4000);
}

/* ================= CLOSE SIDEBAR ================= */

document.addEventListener(
  "click",
  function(e){

    let sidebar =
      document.querySelector(
        ".sidebar"
      );

    let menuBtn =
      document.querySelector(
        ".menu-btn"
      );

    if(
      !sidebar ||
      !menuBtn
    ) return;

    if(
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)
    ){

      sidebar.classList.remove(
        "active"
      );
    }
  }
);

/* ================= INIT ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCartCount();

    renderCart();

    renderWishlist();

    loadWishlistButtons();

    let searchInput =
      document.getElementById(
        "searchInput"
      );

    if(searchInput){

      searchInput.addEventListener(
        "keyup",
        searchProducts
      );
    }
  }
);

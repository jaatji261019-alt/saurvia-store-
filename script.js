// ================= LOAD CART =================
let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

// ================= LOAD WISHLIST =================
let wishlist =
  JSON.parse(localStorage.getItem("wishlist")) || [];

// ================= SAVE CART =================
function saveCart() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}

// ================= SAVE WISHLIST =================
function saveWishlist() {

  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );
}

// ================= UPDATE CART COUNT =================
function updateCartCount() {

  let count = cart.reduce((sum, item) => {

    return sum + item.qty;

  }, 0);

  let cartBox =
    document.querySelector(".cart-box a");

  if (cartBox) {

    cartBox.innerHTML =
      `🛒 Cart (${count})`;
  }
}

// ================= TOAST =================
let currentToast = null;

function showToast(message) {

  if (currentToast) {
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

  }, 100);

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {

      toast.remove();

      currentToast = null;

    }, 300);

  }, 2200);
}

// ================= WISHLIST =================
function toggleWishlist(
  btn,
  productName,
  price = 0,
  image = ""
) {

  let exists =
    wishlist.find(
      item => item.name === productName
    );

  let icon = btn.querySelector("i");

  if (exists) {

    wishlist =
      wishlist.filter(
        item => item.name !== productName
      );

    btn.classList.remove(
      "active-wishlist"
    );

    if (icon) {

      icon.className =
        "fa-regular fa-heart";
    }

    showToast(
      `${productName} removed from wishlist 💔`
    );

  } else {

    wishlist.push({

      name: productName,

      price: price,

      image: image

    });

    btn.classList.add(
      "active-wishlist"
    );

    if (icon) {

      icon.className =
        "fa-solid fa-heart";
    }

    showToast(
      `${productName} added to wishlist ❤️`
    );
  }

  saveWishlist();
}

// ================= LOAD ACTIVE WISHLIST =================
function loadWishlistButtons() {

  let buttons =
    document.querySelectorAll(
      ".wishlist-btn"
    );

  buttons.forEach(btn => {

    let product =
      btn.getAttribute("data-product");

    let icon =
      btn.querySelector("i");

    let exists =
      wishlist.find(
        item => item.name === product
      );

    if (exists) {

      btn.classList.add(
        "active-wishlist"
      );

      if (icon) {

        icon.className =
          "fa-solid fa-heart";
      }
    }
  });
}

// ================= RENDER WISHLIST =================
function renderWishlist() {

  let container =
    document.getElementById(
      "wishlist-items"
    );

  if (!container) return;

  container.innerHTML = "";

  // EMPTY
  if (wishlist.length === 0) {

    container.innerHTML = `

      <div class="empty-wishlist">

        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
          width="120"
        >

        <h2>
          Wishlist is empty ❤️
        </h2>

        <p>
          Save products you love
        </p>

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

  // ITEMS
  wishlist.forEach((item, index) => {

    let div =
      document.createElement("div");

    div.className =
      "wishlist-card";

    div.innerHTML = `

      <div class="wishlist-image">

        <img
          src="${
            item.image ||
            'https://via.placeholder.com/250'
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

// ================= REMOVE WISHLIST =================
function removeFromWishlist(index) {

  if (!wishlist[index]) return;

  showToast(
    `${wishlist[index].name} removed ❌`
  );

  wishlist.splice(index, 1);

  saveWishlist();

  renderWishlist();

  loadWishlistButtons();
}

// ================= MOVE TO CART =================
function moveToCart(index) {

  let item = wishlist[index];

  if (!item) return;

  let existing =
    cart.find(
      cartItem =>
        cartItem.name.toLowerCase() ===
        item.name.toLowerCase()
    );

  if (existing) {

    existing.qty++;

  } else {

    cart.push({

      id: Date.now(),

      name: item.name,

      price: item.price,

      image: item.image,

      qty: 1

    });
  }

  saveCart();

  updateCartCount();

  showToast(
    `${item.name} moved to cart 🛒`
  );
}

// ================= ADD TO CART =================
function buyNow(
  product,
  price,
  image = ""
) {

  price = Number(price);

  if (!product || isNaN(price))
    return;

  let existing =
    cart.find(
      item =>
        item.name.toLowerCase() ===
        product.toLowerCase()
    );

  // AUTO IMAGE
  if (!image && typeof event !== "undefined") {

    let productCard =
      event.target.closest(
        ".product, .product-card"
      );

    if (productCard) {

      let img =
        productCard.querySelector("img");

      if (img) {
        image = img.src;
      }
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

  showToast(
    `${product} added to cart 🛒`
  );
}

// ================= REMOVE FROM CART =================
function removeFromCart(index) {

  if (
    index < 0 ||
    index >= cart.length
  ) return;

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

    showToast(
      "Cart cleared 🗑️"
    );
  }
}

// ================= CHANGE QUANTITY =================
function changeQty(index, type) {

  if (!cart[index]) return;

  if (type === "inc") {

    cart[index].qty++;

  } else {

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

// ================= RENDER CART =================
function renderCart() {

  let container =
    document.getElementById(
      "cart-items"
    );

  let totalBox =
    document.getElementById("total");

  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  // EMPTY
  if (cart.length === 0) {

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

    if (totalBox) {
      totalBox.innerHTML = "";
    }

    return;
  }

  // ITEMS
  cart.forEach((item, index) => {

    let itemTotal =
      item.price * item.qty;

    total += itemTotal;

    let div =
      document.createElement("div");

    div.className =
      "cart-item";

    div.innerHTML = `

      <div class="cart-left">

        <img
          src="${
            item.image ||
            'https://via.placeholder.com/100'
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
            onclick="changeQty(${index}, 'dec')"
          >
            −
          </button>

          <span class="qty-number">
            ${item.qty}
          </span>

          <button
            class="qty-btn"
            onclick="changeQty(${index}, 'inc')"
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

  // TOTAL
  if (totalBox) {

    totalBox.innerHTML = `

      <div class="total-card">

        <h2>
          Total: ₹${total}
        </h2>

        <button class="checkout-btn">

          Proceed To Checkout

        </button>

      </div>

    `;
  }
}

// ================= SEARCH =================
function searchProducts() {

  let input =
    document.getElementById(
      "searchInput"
    );

  if (!input) return;

  let filter =
    input.value.toLowerCase();

  let products =
    document.querySelectorAll(
      ".product, .product-card"
    );

  products.forEach(product => {

    let title =
      product.querySelector("h3");

    if (!title) return;

    let text =
      title.innerText.toLowerCase();

    if (text.includes(filter)) {

      product.style.display =
        "block";

    } else {

      product.style.display =
        "none";
    }
  });
}

// ================= FILTER =================
function filterProducts(
  category,
  button
) {

  let products =
    document.querySelectorAll(
      ".product, .product-card"
    );

  products.forEach(product => {

    let productCategory =
      product.getAttribute(
        "data-category"
      );

    if (
      category === "all" ||
      productCategory === category
    ) {

      product.style.display =
        "block";

    } else {

      product.style.display =
        "none";
    }
  });

  let buttons =
    document.querySelectorAll(
      ".filter-btn"
    );

  buttons.forEach(btn => {

    btn.classList.remove(
      "active-filter"
    );
  });

  if (button) {

    button.classList.add(
      "active-filter"
    );
  }
}

// ================= QUICK VIEW =================
function quickView(
  name,
  price,
  image
) {

  let modal =
    document.getElementById(
      "quickViewModal"
    );

  let content =
    document.getElementById(
      "quickViewContent"
    );

  if (!modal || !content)
    return;

  modal.style.display =
    "flex";

  content.innerHTML = `

    <div class="quick-view-box">

      <span
        class="close-modal"
        onclick="closeQuickView()"
      >
        ✖
      </span>

      <img
        src="${image}"
        class="quick-view-img"
      >

      <div class="quick-view-info">

        <h2>
          ${name}
        </h2>

        <div class="quick-rating">
          ⭐⭐⭐⭐⭐ (4.9)
        </div>

        <p class="quick-price">
          ₹${price}
        </p>

        <button
          class="quick-cart-btn"
          onclick="buyNow('${name}', ${price}, '${image}')"
        >

          Add To Cart

        </button>

      </div>

    </div>

  `;
}

// ================= CLOSE QUICK VIEW =================
function closeQuickView() {

  let modal =
    document.getElementById(
      "quickViewModal"
    );

  if (modal) {

    modal.style.display =
      "none";
  }
}

// ================= SLIDER =================
let sliderInterval;

let currentSlide = 0;

// SHOW SLIDE
function showSlide(index) {

  let slides =
    document.querySelectorAll(
      ".slide"
    );

  let dots =
    document.querySelectorAll(
      ".dot"
    );

  if (!slides.length) return;

  slides.forEach(slide => {

    slide.classList.remove(
      "active"
    );
  });

  dots.forEach(dot => {

    dot.classList.remove(
      "active-dot"
    );
  });

  currentSlide =
    (index + slides.length) %
    slides.length;

  slides[currentSlide]
    .classList.add("active");

  if (dots[currentSlide]) {

    dots[currentSlide]
      .classList.add(
        "active-dot"
      );
  }
}

// AUTO SLIDER
function startSlider() {

  let slides =
    document.querySelectorAll(
      ".slide"
    );

  if (!slides.length) return;

  showSlide(0);

  if (sliderInterval) {

    clearInterval(
      sliderInterval
    );
  }

  sliderInterval =
    setInterval(() => {

      showSlide(
        currentSlide + 1
      );

    }, 4000);
}

// NEXT
function nextSlide() {

  showSlide(currentSlide + 1);
}

// PREV
function prevSlide() {

  showSlide(currentSlide - 1);
}

// ================= SIDEBAR =================
function toggleSidebar() {

  let sidebar =
    document.querySelector(
      ".sidebar"
    );

  if (sidebar) {

    sidebar.classList.toggle(
      "active"
    );
  }
}

// ================= CATEGORY TOGGLE =================
function toggleCategories() {

  let categoryBox =
    document.querySelector(
      ".sidebar-categories"
    );

  if (categoryBox) {

    categoryBox.classList.toggle(
      "active"
    );
  }
}

// ================= PRODUCT IMAGE =================
function changeMainImage(image) {

  let mainImage =
    document.getElementById(
      "mainProductImage"
    );

  if (mainImage) {

    mainImage.src = image;
  }

  let thumbs =
    document.querySelectorAll(
      ".thumbnail-row img"
    );

  thumbs.forEach(img => {

    img.classList.remove(
      "active-thumb"
    );
  });

  if (
    typeof event !== "undefined"
  ) {

    event.target.classList.add(
      "active-thumb"
    );
  }
}

// ================= PRODUCT QTY =================
let productQty = 1;

function increaseQty() {

  productQty++;

  let qty =
    document.getElementById("qty");

  if (qty) {

    qty.innerText =
      productQty;
  }
}

function decreaseQty() {

  if (productQty > 1) {

    productQty--;
  }

  let qty =
    document.getElementById("qty");

  if (qty) {

    qty.innerText =
      productQty;
  }
}

// ================= ADD PRODUCT TO CART =================
function addProductToCart(
  name,
  price,
  image
) {

  price = Number(price);

  let existing =
    cart.find(
      item =>
        item.name.toLowerCase() ===
        name.toLowerCase()
    );

  if (existing) {

    existing.qty += productQty;

  } else {

    cart.push({

      id: Date.now(),

      name: name,

      price: price,

      image: image,

      qty: productQty

    });
  }

  saveCart();

  updateCartCount();

  showToast(
    `${name} added to cart 🛒`
  );
}

// ================= BUY NOW =================
function buyProductNow(
  name,
  price,
  image
) {

  addProductToCart(
    name,
    price,
    image
  );

  window.location.href =
    "cart.html";
}

// ================= PRODUCT TABS =================
function openTab(tabName) {

  let tabs =
    document.querySelectorAll(
      ".product-tab-content"
    );

  let buttons =
    document.querySelectorAll(
      ".tab-btn"
    );

  tabs.forEach(tab => {

    tab.style.display = "none";
  });

  buttons.forEach(btn => {

    btn.classList.remove(
      "active-tab"
    );
  });

  let activeTab =
    document.getElementById(tabName);

  if (activeTab) {

    activeTab.style.display =
      "block";
  }

  if (
    typeof event !== "undefined"
  ) {

    event.target.classList.add(
      "active-tab"
    );
  }
}

// ================= SHARE PRODUCT =================
function shareProduct() {

  if (navigator.share) {

    navigator.share({

      title:
        document.title,

      text:
        "Check out this product on SAURVIA",

      url:
        window.location.href
    });

  } else {

    navigator.clipboard.writeText(
      window.location.href
    );

    showToast(
      "Product link copied 🔗"
    );
  }
}

// ================= CLOSE SIDEBAR =================
document.addEventListener(
  "click",
  function (e) {

    let sidebar =
      document.querySelector(
        ".sidebar"
      );

    let menuBtn =
      document.querySelector(
        ".menu-btn"
      );

    if (!sidebar || !menuBtn)
      return;

    if (
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {

      sidebar.classList.remove(
        "active"
      );
    }
  }
);

// ================= CLOSE MODAL =================
window.addEventListener(
  "click",
  function (e) {

    let modal =
      document.getElementById(
        "quickViewModal"
      );

    if (e.target === modal) {

      closeQuickView();
    }
  }
);

// ================= INIT =================
document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCartCount();

    renderCart();

    renderWishlist();

    startSlider();

    loadWishlistButtons();

    // SEARCH
    let searchInput =
      document.getElementById(
        "searchInput"
      );

    if (searchInput) {

      searchInput.addEventListener(
        "keyup",
        searchProducts
      );
    }

    // DEFAULT PRODUCT TAB
    let defaultTab =
      document.getElementById(
        "descriptionTab"
      );

    if (defaultTab) {

      defaultTab.style.display =
        "block";
    }
  }
);

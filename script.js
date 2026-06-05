/* =============================================
   SHOPCLONE — script.js
   Cart logic, search, dark mode, toast
   ============================================= */

// ── State ──
// cart is an array of objects: { name, price }
let cart = JSON.parse(localStorage.getItem("shopclone_cart")) || [];

// ── On page load ──
window.addEventListener("DOMContentLoaded", () => {
  // Restore cart from localStorage
  renderCart();
  updateCartCount();

  // Restore dark mode preference
  if (localStorage.getItem("shopclone_theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeBtn").textContent = "☀️ Light Mode";
  }
});

// ── Add to Cart ──
function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  renderCart();
  updateCartCount();
  showToast(`✅ ${name} added to cart!`);
}

// ── Remove one item by index ──
function removeFromCart(index) {
  const removed = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
  showToast(`🗑️ ${removed} removed.`);
}

// ── Clear entire cart ──
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCart();
  renderCart();
  updateCartCount();
  showToast("🧹 Cart cleared!");
}

// ── Save cart to localStorage ──
function saveCart() {
  localStorage.setItem("shopclone_cart", JSON.stringify(cart));
}

// ── Update the cart count badge in navbar ──
function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

// ── Render the cart list and summary ──
function renderCart() {
  const cartItemsEl  = document.getElementById("cartItems");
  const cartSummary  = document.getElementById("cartSummary");
  const emptyCartMsg = document.getElementById("emptyCartMsg");
  const cartTotalEl  = document.getElementById("cartTotal");

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartSummary.style.display  = "none";
    emptyCartMsg.style.display = "block";
    return;
  }

  // Group items by name and count quantities
  const groups = {};
  cart.forEach((item, idx) => {
    if (!groups[item.name]) {
      groups[item.name] = { price: item.price, qty: 0, indices: [] };
    }
    groups[item.name].qty++;
    groups[item.name].indices.push(idx);
  });

  // Render each group
  Object.entries(groups).forEach(([name, data]) => {
    const li = document.createElement("li");

    const subtotal = data.price * data.qty;

    li.innerHTML = `
      <span class="item-name">${name}</span>
      <span class="item-qty">x${data.qty}</span>
      <span class="item-price">₹${subtotal.toLocaleString("en-IN")}</span>
      <button
        onclick="removeFromCart(${data.indices[data.indices.length - 1]})"
        style="
          background:none;
          border:none;
          cursor:pointer;
          font-size:1rem;
          color:#cc3333;
          padding:0 4px;
          line-height:1;
        "
        title="Remove one"
      >✕</button>
    `;

    cartItemsEl.appendChild(li);
  });

  // Calculate and display total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = "₹" + total.toLocaleString("en-IN");

  cartSummary.style.display  = "flex";
  emptyCartMsg.style.display = "none";
}

// ── Search / Filter products ──
function searchProducts() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const cards = document.querySelectorAll(".product-card");
  const noResults = document.getElementById("noResults");

  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.getAttribute("data-name").toLowerCase();
    const match = name.includes(query);
    card.style.display = match ? "" : "none";
    if (match) visibleCount++;
  });

  noResults.style.display = visibleCount === 0 ? "block" : "none";
}

// ── Toggle Dark Mode ──
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  const btn = document.getElementById("darkModeBtn");

  if (isDark) {
    btn.textContent = "☀️ Light Mode";
    localStorage.setItem("shopclone_theme", "dark");
  } else {
    btn.textContent = "🌙 Dark Mode";
    localStorage.setItem("shopclone_theme", "light");
  }
}

// ── Toast Notification ──
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  // Reset any existing timer
  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}
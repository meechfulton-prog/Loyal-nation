const products = [
  {
    id: "yacht-tee",
    name: "Loyal Nation Yacht Club Tee",
    price: 34,
    desc: "Luxury & Leisure edition. Classic fit. Premium print.",
    img: "images/yacht-shirt.jpg"
  },
  {
    id: "yacht-detail",
    name: "Yacht Club (Close-Up)",
    price: 0,
    desc: "Design close-up preview. Shows print detail and texture.",
    img: "images/yacht-closeup.jpg"
  },
  {
    id: "handshake-logo",
    name: "Loyal Nation Handshake Logo",
    price: 0,
    desc: "Brand mark representing loyalty, trust, and ownership.",
    img: "images/handshake.jpg"
  }
];

// Helpers
const $ = (s) => document.querySelector(s);

// UI refs
const grid = $("#productGrid");
const modal = $("#modal");
const modalOverlay = $("#modalOverlay");
const closeModalBtn = $("#closeModalBtn");
const modalImg = $("#modalImg");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalPrice = $("#modalPrice");
const addToCartBtn = $("#addToCartBtn");
const sizeSelect = $("#sizeSelect");
const qtyInput = $("#qtyInput");

const drawer = $("#drawer");
const openCartBtn = $("#openCartBtn");
const closeCartBtn = $("#closeCartBtn");
const drawerOverlay = $("#drawerOverlay");
const cartItems = $("#cartItems");
const cartCount = $("#cartCount");
const subtotalEl = $("#subtotal");
const clearCartBtn = $("#clearCartBtn");

// Cart state
let selectedProduct = null;
let cart = JSON.parse(localStorage.getItem("ln_cart") || "[]");

function money(n){ return `$${Number(n).toFixed(2)}`; }

// Render products
function renderGrid(){
  grid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="muted">${p.price > 0 ? money(p.price) : "Preview"}</div>
      </div>
    `;
    card.addEventListener("click", () => openProduct(p.id));
    grid.appendChild(card);
  });
}

// Modal
function openProduct(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  selectedProduct = p;

  modalImg.src = p.img;
  modalImg.alt = p.name;
  modalTitle.textContent = p.name;
  modalDesc.textContent = p.desc;
  modalPrice.textContent = p.price > 0 ? money(p.price) : "Preview (No price)";
  qtyInput.value = 1;

  // If it's a preview item, disable add to cart
  if(p.price <= 0){
    addToCartBtn.textContent = "Preview Only";
    addToCartBtn.disabled = true;
    addToCartBtn.style.opacity = "0.6";
  } else {
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.disabled = false;
    addToCartBtn.style.opacity = "1";
  }

  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modal.setAttribute("aria-hidden", "true");
}

modalOverlay.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

// Add to cart
addToCartBtn.addEventListener("click", () => {
  if(!selectedProduct || selectedProduct.price <= 0) return;

  const size = sizeSelect.value;
  const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));

  const key = `${selectedProduct.id}_${size}`;
  const existing = cart.find(i => i.key === key);

  if(existing){
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      size,
      qty,
      img: selectedProduct.img
    });
  }

  persistCart();
  closeModal();
  openCart();
});

// Cart drawer
function openCart(){
  drawer.setAttribute("aria-hidden", "false");
  renderCart();
}

function closeCart(){
  drawer.setAttribute("aria-hidden", "true");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
drawerOverlay.addEventListener("click", closeCart);

function persistCart(){
  localStorage.setItem("ln_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCount.textContent = total;
}

function renderCart(){
  cartItems.innerHTML = "";

  if(cart.length === 0){
    cartItems.innerHTML = `<p class="muted">Your cart is empty.</p>`;
    subtotalEl.textContent = money(0);
    updateCartCount();
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <div class="muted">Size: ${item.size}</div>
        <div class="muted">${money(item.price)} each</div>
      </div>
      <div>
        <div class="cart-actions">
          <button class="qtybtn" data-action="dec">-</button>
          <strong>${item.qty}</strong>
          <button class="qtybtn" data-action="inc">+</button>
        </div>
        <button class="remove" data-action="remove">Remove</button>
      </div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener("click", () => changeQty(item.key, -1));
    row.querySelector('[data-action="inc"]').addEventListener("click", () => changeQty(item.key, +1));
    row.querySelector('[data-action="remove"]').addEventListener("click", () => removeItem(item.key));

    cartItems.appendChild(row);
  });

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  subtotalEl.textContent = money(subtotal);

  updateCartCount();
}

function changeQty(key, delta){
  const item = cart.find(i => i.key === key);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i => i.key !== key);
  persistCart();
  renderCart();
}

function removeItem(key){
  cart = cart.filter(i => i.key !== key);
  persistCart();
  renderCart();
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  persistCart();
  renderCart();
});

// Footer year + call button
$("#year").textContent = new Date().getFullYear();

function callNow(){
  window.location.href = "tel:14434678955";
}
window.callNow = callNow;

// Init
renderGrid();
updateCartCount();

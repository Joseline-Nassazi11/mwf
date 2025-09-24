// --- Global Data Structures and Selectors ---
const productsGrid = document.getElementById("products-grid");
const cartList = document.getElementById("cartList");
const subtotalEl = document.getElementById("subtotal");
const transportFeeEl = document.getElementById("transport-fee");
const totalEl = document.getElementById("total");
const emptyMsgEl = document.getElementById("emptyMsg");
const checkoutBtn = document.getElementById("checkout-btn");

// --- Mock Data (Replace with a backend fetch) ---
const INVENTORY = [
  { name: "Hardwood Timber", price: 20000, inStock: 50 },
  { name: "Softwood Timber", price: 15000, inStock: 100 },
  { name: "Sofa Set (5-Seater)", price: 1200000, inStock: 5 },
  { name: "Dining Table (6-Seater)", price: 850000, inStock: 8 },
  { name: "Cupboard", price: 450000, inStock: 12 },
  { name: "Office Desk", price: 300000, inStock: 25 },
  { name: "Bed Frame (Queen)", price: 600000, inStock: 15 },
  { name: "Poles", price: 5000, inStock: 200 },
];

let cart = JSON.parse(localStorage.getItem("mwf_cart")) || [];

// --- Helper Functions ---
function saveCart() {
  localStorage.setItem("mwf_cart", JSON.stringify(cart));
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const transportFee = subtotal * 0.05;
  const total = subtotal + transportFee;

  subtotalEl.innerText = `UGX ${subtotal.toLocaleString()}`;
  transportFeeEl.innerText = `UGX ${transportFee.toLocaleString()}`;
  totalEl.innerText = `UGX ${total.toLocaleString()}`;
}

// --- Main Render Functions ---

function renderProducts() {
  productsGrid.innerHTML = "";
  INVENTORY.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product";
    productCard.innerHTML = `
            <div class="title">${product.name}</div>
            <div class="meta">${product.inStock} in stock</div>
            <div class="price">UGX ${product.price.toLocaleString()}</div>
            <button class="btn btn-add" data-name="${
              product.name
            }" data-price="${product.price}">Add</button>
        `;
    productsGrid.appendChild(productCard);
  });
}

function renderCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    emptyMsgEl.style.display = "block";
  } else {
    emptyMsgEl.style.display = "none";
    cart.forEach((item) => {
      const cartItemEl = document.createElement("div");
      cartItemEl.className = "cart-item";
      cartItemEl.innerHTML = `
                <div class="left">
                    <div>
                        <div class="name">${item.name}</div>
                        <div class="qty">${
                          item.qty
                        } × UGX ${item.price.toLocaleString()}</div>
                    </div>
                </div>
                <div class="right">
                    <div class="qty-controls">
                        <button class="qty-btn" data-name="${
                          item.name
                        }" data-delta="-1">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" data-name="${
                          item.name
                        }" data-delta="1">+</button>
                    </div>
                    <span class="price">UGX ${(
                      item.price * item.qty
                    ).toLocaleString()}</span>
                    <button class="remove" data-name="${item.name}">✕</button>
                </div>
            `;
      cartList.appendChild(cartItemEl);
    });
  }
  calculateTotals();
}

// --- Event Handlers ---
productsGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-add")) {
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    const item = cart.find((i) => i.name === name);
    if (item) {
      item.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart();
    renderCart();
  }
});

cartList.addEventListener("click", (e) => {
  if (e.target.classList.contains("qty-btn")) {
    const name = e.target.dataset.name;
    const delta = parseInt(e.target.dataset.delta);
    const item = cart.find((i) => i.name === name);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter((i) => i.name !== name);
      }
      saveCart();
      renderCart();
    }
  } else if (e.target.classList.contains("remove")) {
    const name = e.target.dataset.name;
    cart = cart.filter((i) => i.name !== name);
    saveCart();
    renderCart();
  }
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cannot checkout with an empty cart.");
    return;
  }

  const transaction = {
    id: Date.now(),
    items: cart,
    total: parseFloat(totalEl.innerText.replace(/UGX |,/g, "")),
    date: new Date().toISOString(),
    // Add more details like customer name, sales agent, etc.
  };

  // This is where you would send the data to a backend server
  // For now, we will just simulate a successful transaction
  console.log("Checkout transaction:", transaction);
  alert("Payment Successful!\nYour transaction has been recorded.");

  // Clear cart after successful checkout
  cart = [];
  saveCart();
  renderCart();
});

// --- Initial Page Load ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});

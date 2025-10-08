document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cartList");
  const emptyMsg = document.getElementById("emptyMsg");
  const subtotalEl = document.getElementById("subtotal");
  const transportEl = document.getElementById("transport-fee");
  const totalEl = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const printBtn = document.querySelector(".btn-print");
  const customerNameInput = document.getElementById("customerName");

  // Receipt elements
  const receiptItemsBody = document.getElementById("receipt-items");
  const receiptSubtotal = document.getElementById("r-subtotal");
  const receiptTransport = document.getElementById("r-transport");
  const receiptTotal = document.getElementById("r-total");
  const receiptCustomer = document.getElementById("receipt-customer");
  const receiptNumberEl = document.getElementById("receipt-number");

  let cart = [];

  //  Add to Cart 
  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);

      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, price, qty: 1 });
      }

      updateCartUI();
    });
  });

  //  Update Cart Display 
  function updateCartUI() {
    cartList.innerHTML = "";
    if (cart.length === 0) {
      emptyMsg.style.display = "block";
    } else {
      emptyMsg.style.display = "none";
      cart.forEach((item) => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
          <span class="name">${item.name}</span>
          <div>
            <span class="qty">x${item.qty}</span>
            <span class="price">UGX ${(
              item.price * item.qty
            ).toLocaleString()}</span>
            <button class="remove">✕</button>
          </div>
        `;
        li.querySelector(".remove").addEventListener("click", () => {
          cart = cart.filter((x) => x.id !== item.id);
          updateCartUI();
        });
        cartList.appendChild(li);
      });
    }

    updateTotals();
  }

  //  Update Totals 
  function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const transport = subtotal * 0.05;
    const total = subtotal + transport;

    subtotalEl.textContent = `UGX ${subtotal.toLocaleString()}`;
    transportEl.textContent = `UGX ${transport.toLocaleString()}`;
    totalEl.textContent = `UGX ${total.toLocaleString()}`;
  }

  //  Checkout (optional save) 
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    alert("Checkout completed successfully!");
  });

  //  Print Receipt 
  printBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("No items in cart to print.");
      return;
    }

    // Generate Receipt Number (MWF-YYYYMMDD-###)
    const today = new Date();
    const datePart = today.toISOString().split("T")[0].replace(/-/g, "");
    const randomPart = String(Math.floor(Math.random() * 999)).padStart(3, "0");
    const receiptNumber = `MWF-${datePart}-${randomPart}`;

    receiptNumberEl.textContent = receiptNumber;

    // Populate Customer Name
    receiptCustomer.textContent = customerNameInput.value.trim() || "Walk-in";

    // Populate Receipt Items
    receiptItemsBody.innerHTML = "";
    cart.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${(item.price * item.qty).toLocaleString()}</td>
      `;
      receiptItemsBody.appendChild(tr);
    });

    // Calculate totals for receipt
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const transport = subtotal * 0.05;
    const total = subtotal + transport;

    receiptSubtotal.textContent = `UGX ${subtotal.toLocaleString()}`;
    receiptTransport.textContent = `UGX ${transport.toLocaleString()}`;
    receiptTotal.textContent = `UGX ${total.toLocaleString()}`;

    // Show print section & print
    const printSection = document.getElementById("print-section");
    printSection.style.display = "block";

    // Print and hide after printing
    window.print();
    setTimeout(() => {
      printSection.style.display = "none";
    }, 1000);
  });
});

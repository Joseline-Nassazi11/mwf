// For coverting unitprice * quantity to get totalprice
// document.getElementById("unitPrice").addEventListener("input", calculateTotal);
// document.getElementById("quantity").addEventListener("input", calculateTotal);

// function calculateTotal() {
//   const unitPrice = parseFloat(document.getElementById("unitPrice").value);
//   const quantity = parseFloat(document.getElementById("quantity").value);
//   const totalPrice = document.getElementById("totalPrice");

//   if (!isNaN(quantity) && !isNaN(unitPrice)) {
//     totalPrice.value = (unitPrice * quantity).toFixed(0);
//   } else {
//     totalPrice.value = "";
//   }
// }

//  Auto Calculate Total Price 
console.log(" calctotal.js is loaded!");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const unitPrice = document.getElementById("unitPrice");
  const quantity = document.getElementById("quantity");
  const totalPrice = document.getElementById("totalPrice");

  // Safety check: ensure form and inputs exist
  if (!form) {
    console.error(" Form not found.");
    return;
  }

  //  AUTO CALCULATE TOTAL PRICE 
  function calculateTotal() {
    const u = parseFloat(unitPrice.value);
    const q = parseFloat(quantity.value);

    if (!isNaN(u) && !isNaN(q)) {
      totalPrice.value = (u * q).toFixed(0);
    } else {
      totalPrice.value = "";
    }
  }

  if (unitPrice && quantity) {
    unitPrice.addEventListener("input", calculateTotal);
    quantity.addEventListener("input", calculateTotal);
  }

  //  FORM VALIDATION 
  form.addEventListener("submit", (e) => {
    let isValid = true;

    // Remove old errors and valid messages
    document
      .querySelectorAll(".error-message, .valid-message")
      .forEach((el) => el.remove());
    document
      .querySelectorAll(".error, .valid")
      .forEach((el) => el.classList.remove("error", "valid"));

    const fields = [
      "customerName",
      "productType",
      "product",
      "quantity",
      "unitPrice",
      "totalPrice",
      "paymentType",
    ];

    fields.forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;

      const parent = field.parentNode;
      let value = field.value.trim();

      const isNumberInvalid =
        field.type === "number" && (value === "" || parseFloat(value) <= 0);

      if (value === "" || isNumberInvalid) {
        isValid = false;
        field.classList.add("error");

        const msg = document.createElement("small");
        msg.classList.add("error-message");
        msg.textContent = "Invalid field";
        parent.appendChild(msg);
      } else {
        field.classList.add("valid");
        const msg = document.createElement("small");
        msg.classList.add("valid-message");
        msg.textContent = "Valid";
        parent.appendChild(msg);
      }
    });

    if (!isValid) {
      e.preventDefault();
      console.warn(" Form blocked due to validation errors");
    }
  });
});

console.log("suppliers.js loaded successfully");

document.addEventListener("DOMContentLoaded", () => {
  // show inline validation messages
  function validateField(field, message, isValid) {
    const oldMsg = field.parentNode.querySelector(
      ".error-message, .valid-message"
    );
    if (oldMsg) oldMsg.remove();

    field.classList.remove("error", "valid");

    const msg = document.createElement("small");
    msg.textContent = message;
    msg.classList.add(isValid ? "valid-message" : "error-message");

    field.classList.add(isValid ? "valid" : "error");
    field.parentNode.appendChild(msg);
  }

  // Validation rules
  const phonePattern = /^[0-9]{9,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to validate a single form 
  function validateSupplierForm(form) {
    let valid = true;

    const name = form.querySelector("#name");
    const phone = form.querySelector("#phone");
    const email = form.querySelector("#email");
    const address = form.querySelector("#address");

    //  Name 
    if (!name.value.trim()) {
      validateField(name, "Supplier name is required", false);
      valid = false;
    } else {
      validateField(name, "Valid", true);
    }

    //  Phone 
    if (!phone.value.trim() || !phonePattern.test(phone.value)) {
      validateField(phone, "Enter a valid phone number (min 9 digits)", false);
      valid = false;
    } else {
      validateField(phone, "Valid", true);
    }

    //  Email 
    if (!email.value.trim()) {
      validateField(email, "Email is required", false);
      valid = false;
    } else if (!emailPattern.test(email.value)) {
      validateField(email, "Invalid email format", false);
      valid = false;
    } else {
      validateField(email, "Valid", true);
    }

    // Address 
    if (!address.value.trim() || address.value.trim().length < 3) {
      validateField(address, "Address is required (min 3 characters)", false);
      valid = false;
    } else {
      validateField(address, "Valid", true);
    }

    return valid;
  }

  //  Add Supplier Form
  const addForm = document.querySelector(
    "form[action='/dashboard/suppliers/add']"
  );
  if (addForm) {
    addForm.setAttribute("novalidate", "true");
    addForm.addEventListener("submit", (e) => {
      if (!validateSupplierForm(addForm)) e.preventDefault();
    });
  }

  //  Edit Supplier Forms 
  const editForms = document.querySelectorAll(
    "form[action^='/dashboard/suppliers/edit/']"
  );
  editForms.forEach((form) => {
    form.setAttribute("novalidate", "true");
    form.addEventListener("submit", (e) => {
      if (!validateSupplierForm(form)) e.preventDefault();
    });
  });
});

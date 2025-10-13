console.log("register-atttendant.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[action='/register-attendant']");

  // Helper to show messages under each field
  function showMessage(input, message, isValid) {
    const oldMsg = input.parentNode.querySelector(
      ".error-message, .valid-message"
    );
    if (oldMsg) oldMsg.remove();

    input.classList.remove("error", "valid");
    const msg = document.createElement("small");
    msg.textContent = message;
    msg.classList.add(isValid ? "valid-message" : "error-message");
    input.classList.add(isValid ? "valid" : "error");
    input.parentNode.appendChild(msg);
  }

  // Validation patterns
  const phonePattern = /^\+256\d{9}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ninPattern = /^[A-Za-z0-9]{13}$/;    // 13 characters

  form.addEventListener("submit", (e) => {
    let valid = true;

    const fullName = form.querySelector("input[name='fullName']");
    const age = form.querySelector("input[name='age']");
    const nin = form.querySelector("input[name='nin']");
    const phone = form.querySelector("input[name='phone']");
    const email = form.querySelector("input[name='email']");
    const gender = form.querySelector("select[name='gender']");
    const password = form.querySelector("input[name='password']");

    // Full Name
    if (!fullName.value.trim() || fullName.value.trim().length < 3) {
      showMessage(fullName, "Full name must be at least 3 characters", false);
      valid = false;
    } else {
      showMessage(fullName, "Valid ", true);
    }

    // Age
    if (!age.value || parseInt(age.value) < 18) {
      showMessage(age, "Age must be 18 or above", false);
      valid = false;
    } else {
      showMessage(age, "Valid ", true);
    }

    // NIN
    if (!nin.value.trim() || !ninPattern.test(nin.value)) {
      showMessage(nin, "Enter a valid National ID (13 characters)", false);
      valid = false;
    } else {
      showMessage(nin, "Valid ", true);
    }

    // Phone
    if (!phone.value.trim() || !phonePattern.test(phone.value)) {
      showMessage(
        phone,
        "Enter a valid Ugandan number (e.g. +2567XXXXXXXX)",
        false
      );
      valid = false;
    } else {
      showMessage(phone, "Valid ", true);
    }

    // Email
    if (!email.value.trim() || !emailPattern.test(email.value)) {
      showMessage(email, "Enter a valid email address", false);
      valid = false;
    } else {
      showMessage(email, "Valid ", true);
    }

    // Gender
    if (!gender.value.trim()) {
      showMessage(gender, "Please select a gender", false);
      valid = false;
    } else {
      showMessage(gender, "Valid ", true);
    }

    // Password
    if (!password.value.trim() || password.value.trim().length < 5) {
      showMessage(password, "Password must be at least 5 characters", false);
      valid = false;
    } else {
      showMessage(password, "Valid ", true);
    }

    // Stop form if validation fails
    if (!valid) {
      e.preventDefault();
    }
  });
});

console.log("signup.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  //  Helper to display validation messages 
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

  //  Validation Patterns 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    let valid = true;

    const fullName = form.querySelector("input[name='fullName']");
    const email = form.querySelector("input[name='email']");
    const password = form.querySelector("input[name='password']");
    const confirmPassword = form.querySelector("input[name='confirmPassword']");
    const role = form.querySelector("select[name='role']");

    //  Full Name 
    if (!fullName.value.trim() || fullName.value.trim().length < 3) {
      showMessage(fullName, "Full name must be at least 3 characters", false);
      valid = false;
    } else {
      showMessage(fullName, "Valid ", true);
    }

    //  Email 
    if (!email.value.trim() || !emailPattern.test(email.value)) {
      showMessage(email, "Please enter a valid email address", false);
      valid = false;
    } else {
      showMessage(email, "Valid ", true);
    }

    //  Password 
    if (!password.value.trim() || password.value.trim().length < 5) {
      showMessage(password, "Password must be at least 5 characters", false);
      valid = false;
    } else {
      showMessage(password, "Valid", true);
    }

    //  Confirm Password 
    if (confirmPassword.value.trim() !== password.value.trim()) {
      showMessage(confirmPassword, "Passwords do not match", false);
      valid = false;
    } else if (confirmPassword.value.trim().length < 5) {
      showMessage(
        confirmPassword,
        "Password confirmation must be at least 5 characters",
        false
      );
      valid = false;
    } else {
      showMessage(confirmPassword, "Match ", true);
    }

    //  Role 
    if (!role.value.trim()) {
      showMessage(role, "Please select a role", false);
      valid = false;
    } else {
      showMessage(role, "Valid ", true);
    }

    // Stop submission if any validation fails
    if (!valid) {
      e.preventDefault();
    }
  });
});

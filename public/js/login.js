document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Create error message elements dynamically 
  const emailError = document.createElement("span");
  emailError.id = "emailError";
  emailError.classList.add("error-message");
  emailInput.parentNode.appendChild(emailError);

  const passwordError = document.createElement("span");
  passwordError.id = "passwordError";
  passwordError.classList.add("error-message");
  passwordInput.parentNode.appendChild(passwordError);

  form.addEventListener("submit", (e) => {
    let valid = true;

    // Clear old errors and styles
    [emailInput, passwordInput].forEach((input) =>
      input.classList.remove("error")
    );
    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      valid = false;
      emailError.textContent = "Please enter a valid email address.";
      emailInput.classList.add("error");
    }

    if (password.length < 5) {
      valid = false;
      passwordError.textContent =
        "Password must be at least 5 characters long.";
      passwordInput.classList.add("error");
    }

    if (!valid) e.preventDefault();
  });

  // Clear errors when typing
  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error");
      if (input.id === "email") emailError.textContent = "";
      if (input.id === "password") passwordError.textContent = "";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    this.querySelector("i").classList.toggle("fa-eye");
    this.querySelector("i").classList.toggle("fa-eye-slash");
  });
});

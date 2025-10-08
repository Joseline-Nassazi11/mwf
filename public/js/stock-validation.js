document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("stockForm");
  const inputs = form.querySelectorAll("input, select");
  const toast = document.getElementById("toastMessage");

  // Add error containers
  inputs.forEach((input) => {
    const error = document.createElement("div");
    error.className = "error-message";
    input.insertAdjacentElement("afterend", error);
  });

  form.addEventListener("submit", (e) => {
    let valid = true;

    inputs.forEach((input) => {
      const error = input.nextElementSibling;
      error.textContent = "";
      input.classList.remove("error", "valid");

      const value = input.value.trim();

      // Required check
      if (input.hasAttribute("required") && !value) {
        valid = false;
        error.textContent = "This field is required.";
        input.classList.add("error");
        return;
      }

      // Number validation
      if (input.type === "number" && value !== "") {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
          valid = false;
          error.textContent = "Please enter a valid non-negative number.";
          input.classList.add("error");
          return;
        }
      }

      // Date validation
      if (input.type === "date" && value === "") {
        valid = false;
        error.textContent = "Please select a valid date.";
        input.classList.add("error");
        return;
      }

      // Select validation
      if (
        input.tagName === "SELECT" &&
        input.hasAttribute("required") &&
        !value
      ) {
        valid = false;
        error.textContent = "Please select a quality grade.";
        input.classList.add("error");
        return;
      }

      input.classList.add("valid");
    });

    //  Stop form only if invalid
    if (!valid) {
      e.preventDefault();
      showToast(" Please fix errors before saving!");
    } else {
      //  Let form submit to backend and save in DB
      showToast(" Product saved successfully!");
    }
  });

  // Clear errors while typing
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error");
      input.nextElementSibling.textContent = "";
    });
  });

  //  Toast Function 
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});

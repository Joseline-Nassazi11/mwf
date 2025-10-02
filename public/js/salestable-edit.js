document.addEventListener("DOMContentLoaded", () => {
  const editModal = document.getElementById("editModal");

  if (editModal) {
    editModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;

      // Get attributes from the clicked button
      const id = button.getAttribute("data-id");
      const customer = button.getAttribute("data-customer");
      const product = button.getAttribute("data-product");
      const unitPrice = button.getAttribute("data-unitprice");
      const quantity = button.getAttribute("data-quantity");
      const totalPrice = button.getAttribute("data-totalprice");
      const paymentType = button.getAttribute("data-paymenttype");
      const transport = button.getAttribute("data-transport");

      // Populate form fields
      document.getElementById("modalCustomerName").value = customer || "";
      document.getElementById("modalProduct").value = product || "";
      document.getElementById("modalUnitPrice").value = unitPrice || "";
      document.getElementById("modalQuantity").value = quantity || "";
      document.getElementById("modalTotalPrice").value = totalPrice || "";
      document.getElementById("modalPaymentType").value = paymentType || "Cash";
      document.getElementById("modalTransport").value = transport;

      // Set form action dynamically to match Express PUT route
      const form = document.getElementById("editSaleForm");
      form.action = `/sales/${id}`;
    });
  }

  // Auto-calculate total price
  const unitPriceInput = document.getElementById("modalUnitPrice");
  const quantityInput = document.getElementById("modalQuantity");
  const totalPriceInput = document.getElementById("modalTotalPrice");

  function calculateTotal() {
    const unit = parseFloat(unitPriceInput.value) || 0;
    const qty = parseFloat(quantityInput.value) || 0;
    totalPriceInput.value = (unit * qty).toFixed(2);
  }

  if (unitPriceInput && quantityInput && totalPriceInput) {
    unitPriceInput.addEventListener("input", calculateTotal);
    quantityInput.addEventListener("input", calculateTotal);
  }
});

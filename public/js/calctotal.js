// For coverting unitprice * quantity to get totalprice
document.getElementById("unitPrice").addEventListener("input", calculateTotal);
document.getElementById("quantity").addEventListener("input", calculateTotal);

function calculateTotal() {
  const unitPrice = parseFloat(document.getElementById("unitPrice").value);
  const quantity = parseFloat(document.getElementById("quantity").value);
  const totalPrice = document.getElementById("totalPrice");

  if (!isNaN(quantity) && !isNaN(unitPrice)) {
    totalPrice.value = (unitPrice * quantity).toFixed(0);
  } else {
    totalPrice.value = "";
  }
}

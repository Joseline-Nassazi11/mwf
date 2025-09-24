const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const productCards = document.querySelectorAll(".card");

function filterProducts() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  productCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const cat = card.dataset.category;

    const matchSearch = name.includes(search);
    const matchCategory = category === "all" || cat === category;

    if (matchSearch && matchCategory) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

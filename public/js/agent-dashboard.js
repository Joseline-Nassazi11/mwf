document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".kpi-number");

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText.replace(/,/g, "");
      const increment = target / 200; // Speed control

      if (count < target) {
        counter.innerText = Math.ceil(count + increment).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    updateCount();
  });
});

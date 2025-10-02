// public/js/dashboard_scripts.js

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("salesChart");

  // MOCK DATA for the graph (In a real app, this would be passed from the backend)
  const salesData = {
    labels: [
      "Day -6",
      "Day -5",
      "Day -4",
      "Day -3",
      "Day -2",
      "Yesterday",
      "Today",
    ],
    datasets: [
      {
        label: "Total Daily Revenue (UGX)",
        data: [2000000, 3500000, 1500000, 4200000, 2800000, 5100000, 4800000], // Example data
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: salesData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Daily Sales Performance",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Revenue (UGX)",
            },
          },
        },
      },
    });
  }
});

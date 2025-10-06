document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("salesChart").getContext("2d");

  if (!chartLabels || !chartRevenue) {
    console.error("Chart data not found");
    return;
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Revenue (UGX)",
          data: chartRevenue,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 4,
        },
        {
          label: "Transactions",
          data: chartTransactions,
          borderColor: "#2196F3",
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 4,
          yAxisID: "y1", // second axis
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: true },
        title: { display: true, text: "Sales Trend (Last 7 Days)" },
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: { display: true, text: "Revenue (UGX)" },
          beginAtZero: true,
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: { display: true, text: "Transactions" },
          grid: { drawOnChartArea: false },
          beginAtZero: true,
        },
      },
    },
  });
});

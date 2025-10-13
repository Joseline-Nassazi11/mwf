const ctx = document.getElementById("salesChart").getContext("2d");
new Chart(ctx, {
  type: "line", 
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Sales (UGX)",
        data: [500000, 750000, 1200000, 900000, 1500000, 1800000],
        backgroundColor: "rgba(13, 110, 253, 0.2)",
        borderColor: "#0d6efd",
        borderWidth: 2,
        fill: true,
        tension: 0.4, // smooth curve
        pointBackgroundColor: "#0d6efd",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: "#333" } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#333" },
      },
      x: {
        ticks: { color: "#333" },
      },
    },
  },
});

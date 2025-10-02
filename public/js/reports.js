function exportTableToExcel(tableID, filename = "") {
  var wb = XLSX.utils.table_to_book(document.getElementById(tableID), {
    sheet: "Sheet1",
  });
  XLSX.writeFile(wb, filename + ".xlsx");
}
function exportTableToPDF(tableID, title) {
  const { jsPDF } = window.jspdf;
  var doc = new jsPDF();
  doc.text(title, 14, 20);
  doc.autoTable({ html: "#" + tableID, startY: 25 });
  doc.save(title + ".pdf");
}

// Search Filter Script
      document.addEventListener('DOMContentLoaded', function () {
        const salesSearch = document.getElementById('salesSearch');
        const stockSearch = document.getElementById('stockSearch');

        salesSearch.addEventListener('input', function () {
          const filter = this.value.toLowerCase();
          document.querySelectorAll('#salesTable tbody tr').forEach(row => {
            row.style.display = [...row.cells].some(cell => cell.textContent.toLowerCase().includes(filter)) ? '' : 'none';
          });
        });

        stockSearch.addEventListener('input', function () {
          const filter = this.value.toLowerCase();
          document.querySelectorAll('#stockTable tbody tr').forEach(row => {
            row.style.display = [...row.cells].some(cell => cell.textContent.toLowerCase().includes(filter)) ? '' : 'none';
          });
        });
      });

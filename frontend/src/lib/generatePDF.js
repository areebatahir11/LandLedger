import jsPDF from "jspdf";

export function generatePDF(land) {
  const doc = new jsPDF();

  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Border
  doc.setDrawColor(0); // black
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

  // Title
  doc.setFont("courier", "bold");
  doc.setFontSize(22);
  doc.text("Land Ownership Certificate", pageWidth / 2, 30, {
    align: "center",
  });

  // Body Content
  doc.setFont("courier", "normal");
  doc.setFontSize(14);
  let y = 50;
  const spacing = 10;

  doc.text(`Plot Number:     ${land.plotNumber || "N/A"}`, 20, y);
  y += spacing;
  doc.text(`Location:        ${land.location || "N/A"}`, 20, y);
  y += spacing;
  doc.text(`Area:            ${land.area ? `${land.area} sq ft` : "N/A"}`, 20, y);
  y += spacing;
  doc.text(`Owner Address:   ${land.currentOwner || "N/A"}`, 20, y);
  y += spacing;

  const now = new Date();
  const dateStr = now.toLocaleString();
  doc.text(`Date Issued:     ${dateStr}`, 20, y);
  y += 2 * spacing;

  doc.line(120, y, 190, y);
  doc.text("Signature / Authority", 135, y + 7);

  const fileName = `${land.plotNumber || "Land"}_Certificate.pdf`;
  doc.save(fileName);
}

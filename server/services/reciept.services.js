import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateReceiptPDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = "uploads";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const filePath = path.join(dir, `receipt-${Date.now()}.pdf`);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.rect(0, 0, 595, 120).fill("#FFF");

      const logoPath = path.join("public", "xvital-logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 35, { width: 120 });
      }

      doc.fillColor("#000").fontSize(20).text("Consultation Receipt", 350, 50);

      // Card
      doc.roundedRect(40, 140, 515, 600, 20).fill("#fff");
      doc.strokeColor("#eee").roundedRect(40, 140, 515, 600, 20).stroke();

      let y = 200;

      const row = (label, value) => {
        doc.fillColor("#666").fontSize(11).text(label, 70, y);
        doc.fillColor("#111").fontSize(14).text(value, 260, y);
        y += 40;
      };

      row("Client", data.name || "Client");
      row("Email", data.email);
      row("Date", data.date);
      row("Time", data.time);
      row("Amount", "₹999");
      row("Payment ID", data.paymentId);
      row("Status", "SUCCESS");

      // Paid badge
      doc.roundedRect(70, y + 10, 120, 35, 20).fill("#4EDDE2");
      doc.fillColor("#3E1747").fontSize(13).text("PAID", 110, y + 20);

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
};
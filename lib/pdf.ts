import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QuoteData {
  clientName: string;
  projectLabel: string;
  pages: number;
  tier: string;
  minPrice: number;
  maxPrice: number;
  deposit: number;
  balance: number;
  baseRate: number;
  pageCost: number;
  selectedFeatureDetails: { label: string; cost: number }[];
  revisionCost: number;
  rushCost: number;
  timelineLabel: string;
  revisionLabel: string;
  hostingMin: number;
  hostingMax: number;
  date: string;
}

export function generateQuotePDF(data: QuoteData) {
  const doc = new jsPDF();
  const navy: [number, number, number] = [27, 42, 74];
  const gold: [number, number, number] = [196, 150, 26];
  const darkGray: [number, number, number] = [51, 51, 51];
  const medGray: [number, number, number] = [119, 119, 119];
  const lightBg: [number, number, number] = [245, 243, 238];

  // Header bar
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 40, 'F');

  // Gold accent line
  doc.setFillColor(...gold);
  doc.rect(0, 40, 210, 2, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('WESLEYCONSULTS', 20, 22);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('IT Consulting & Digital Solutions', 20, 30);

  // Contact info in header
  doc.setFontSize(8);
  doc.text('wesleyconsults@gmail.com  |  0500610780  |  Takoradi, Ghana', 20, 36);

  // Quote title section
  doc.setTextColor(...navy);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT QUOTATION', 20, 58);

  // Gold underline
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.8);
  doc.line(20, 61, 80, 61);

  // Client details box
  doc.setFillColor(...lightBg);
  doc.roundedRect(20, 68, 170, 28, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(...medGray);
  doc.text('PREPARED FOR', 28, 77);
  doc.setTextColor(...darkGray);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(data.clientName || 'Client Name', 28, 84);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...medGray);
  doc.text(`Date: ${data.date}`, 140, 77);
  doc.text(`Tier: ${data.tier}`, 140, 84);

  // Project overview
  let y = 108;
  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Project overview', 20, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  doc.text(`${data.projectLabel} website  •  ${data.pages} pages  •  ${data.timelineLabel}`, 20, y);
  doc.text(`${data.revisionLabel} revision rounds`, 20, y + 6);

  // Price breakdown table
  y += 18;
  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Price breakdown', 20, y);
  y += 4;

  const rows: (string | number)[][] = [];
  rows.push(['Base design & development', `GHS ${data.baseRate.toLocaleString()}`]);
  if (data.pageCost > 0) {
    rows.push([`Additional pages (${data.pages - 5} × GHS 250)`, `GHS ${data.pageCost.toLocaleString()}`]);
  }
  data.selectedFeatureDetails.forEach(f => {
    rows.push([f.label, `GHS ${f.cost.toLocaleString()}`]);
  });
  if (data.revisionCost > 0) {
    rows.push(['Extra revision rounds', `GHS ${data.revisionCost.toLocaleString()}`]);
  }
  if (data.rushCost > 0) {
    rows.push(['Rush delivery fee (30%)', `GHS ${data.rushCost.toLocaleString()}`]);
  }

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Amount']],
    body: rows,
    foot: [[
      'RECOMMENDED PRICE RANGE',
      `GHS ${data.minPrice.toLocaleString()} – ${data.maxPrice.toLocaleString()}`
    ]],
    theme: 'plain',
    margin: { left: 20, right: 20 },
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
      textColor: darkGray,
    },
    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    footStyles: {
      fillColor: lightBg,
      textColor: navy,
      fontStyle: 'bold',
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [252, 251, 248],
    },
  });

  // Payment terms
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 14;

  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment terms', 20, y);
  y += 8;

  // Deposit / balance boxes
  doc.setFillColor(...navy);
  doc.roundedRect(20, y, 80, 22, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('30% DEPOSIT (TO START)', 28, y + 8);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`GHS ${data.deposit.toLocaleString()}`, 28, y + 17);

  doc.setFillColor(...lightBg);
  doc.roundedRect(110, y, 80, 22, 2, 2, 'F');
  doc.setTextColor(...darkGray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('70% BALANCE (ON DELIVERY)', 118, y + 8);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`GHS ${data.balance.toLocaleString()}`, 118, y + 17);

  // Hosting section
  y += 34;
  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Hosting & domain (billed separately, annual)', 20, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    body: [
      ['Domain registration', 'GHS 80 – 150 / year'],
      ['Web hosting', 'GHS 100 – 200 / year'],
      ['Management & support', 'GHS 150 – 250 / year'],
      ['Total hosting package', `GHS ${data.hostingMin} – ${data.hostingMax} / year`],
    ],
    theme: 'plain',
    margin: { left: 20, right: 20 },
    styles: {
      fontSize: 9,
      cellPadding: { top: 3, bottom: 3, left: 6, right: 6 },
      textColor: darkGray,
    },
    columnStyles: {
      1: { halign: 'right' },
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(...navy);
  doc.rect(0, pageHeight - 18, 210, 18, 'F');
  doc.setTextColor(...gold);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('WesleyConsults  •  Takoradi, Ghana  •  wesleyconsults@gmail.com  •  0500610780', 105, pageHeight - 8, { align: 'center' });

  return doc;
}

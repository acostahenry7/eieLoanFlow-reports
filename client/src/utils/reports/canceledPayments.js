import { jsPDF } from "jspdf";
import {
  createTitle,
  createSubTitle,
  createMainTitle,
  createMainSubTitle,
  createDate,
  currencyFormat,
  generateReportSection,
  spacing,
  sectionSpacing,
  getTextWidth,
} from "./report-helpers";

let colsWidth = [85, 105, 135, 193, 220];

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 10;
  let top = 40;
  let left = 10;
  let right = left + 140;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 25;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `pagos-cancelados-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `PAGOS CANCELADOS`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, center, headerTop);
  createMainSubTitle(doc, subTitle, center + 8, headerTop + spacing + 0.8);
  createDate(doc, date, center + 14, headerTop + spacing * 2);

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item, index) => {
    //Comment spacing
    let commentSpacing = formatComment(item.comment, 15)[1] * 0.1;
    //Adding one entry
    let customerName = `${item.customer_name
      .split(" ")
      .map((item, index) => (index <= 3 ? item : undefined))
      .filter((item) => item != undefined)
      .join(" ")}`;
    doc.text(`${customerName}`, left + 1, top + commentSpacing);
    createSubTitle(
      doc,
      `${item.loan_number_id}`,
      left + colsWidth[0],
      top + commentSpacing
    );
    doc.text(
      `${item.receipt_number}`,
      left + colsWidth[1],
      top + commentSpacing
    );
    doc.text(
      `${item.employee_name}`,
      left + colsWidth[2],
      top + commentSpacing
    );
    doc.text(
      `${
        new Date(item.last_modified_date).toLocaleString("es-Es").split(",")[0]
      }`,
      left + colsWidth[3],
      top + commentSpacing
    );
    createSubTitle(
      doc,
      `${formatComment(item.comment, 15)[0]}`,
      left + colsWidth[4],
      top
    );

    for (let i = 0; i < formatComment(item.comment, 12)[1]; i++) {
      top += 0.2;
    }
    // doc.text(`${item.arrear_percentaje}%`, left + 155, top);
    // doc.text(
    //   `${new Date(item.defeated_since).toLocaleString("es-Es").split(",")[0]}`,
    //   left + 180,
    //   top
    // );
    // doc.text(`${item.defeated_amount}`, left + 210, top);
    top += spacing;
    counter++;
    if (counter == itemsPerPage) {
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "Cliente", pos + 1, top);
  createSubTitle(doc, "Préstamo", pos + colsWidth[0], top);
  createSubTitle(doc, "Recibo", pos + colsWidth[1], top, "center");
  createSubTitle(doc, "Empleado", pos + colsWidth[2], top);
  createSubTitle(doc, "Fecha\nCancelación", pos + colsWidth[3], top - 2);
  createSubTitle(doc, "Comentario", pos + colsWidth[4], top);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

function formatComment(comment, aproxLimit) {
  let str = "";
  let counter = 0;
  let lastIterationValue = 0;
  for (let i = 0; i < comment?.length; i++) {
    counter++;
    str += comment[i];
    if (counter >= aproxLimit && comment[i + 1] == " ") {
      counter = 0;
      str += "\n";
    }

    lastIterationValue = i;
  }

  return [str, lastIterationValue];
}

console.log(formatComment("HOLA YO SOY EL PRINCIPE DE PERSIA"));

export { generateReport };

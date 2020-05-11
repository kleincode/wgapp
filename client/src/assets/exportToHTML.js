import i18n from "@/i18n";

function exportToHTML(lastBill, maxDate, currency, locale, jsonData) {
  let total = jsonData.total;
  let includeMonthlyCharges = jsonData.includeMonthlyCharges;
  let monthlyTotal = jsonData.monthlyTotal;
  let mean = jsonData.mean;
  let memberTotals = jsonData.memberTotals;
  let memberDebts = jsonData.memberDebts;
  let debts = jsonData.debts;
  var myWindow = window.open(
    "",
    "Jeff Organizer - " + i18n.t("finances.compensationPayments"),
    "toolbar=yes,scrollbars=yes,resizable=yes,width=700,height=900"
  );
  myWindow.document.write(
    '<html><head><link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"><title>WGApp - ' +
      i18n.t("finances.compensationPayments") +
      "</title></head><body><h1>" +
      i18n.t("finances.compensationPayments") +
      "</h1><h3>" +
      lastBill +
      i18n.t("finances.export.until") +
      maxDate +
      '</h3><hr style="margin-bpottom: 15px">'
  );
  let css =
    "<style>body { font-family: 'Roboto', sans-serif; } table, th, td { border: 1px solid black; border-collapse: collapse;} table { border-spacing: 5px; } th, td {padding: 5px;}</style>";
  myWindow.document.write(
    "<h2>" +
      i18n.t("finances.expenses") +
      "</h2> <ul><li><b>" +
      i18n.t("finances.billManager.monthlyTotal") +
      ": " +
      getCurrency(total, currency, locale) +
      " </b></li>"
  );
  if (includeMonthlyCharges) {
    myWindow.document.write(
      "<li>" +
        i18n.t("finances.billManager.monthlyTotal") +
        ": " +
        getCurrency(monthlyTotal, currency, locale) +
        "</li>"
    );
  }
  myWindow.document.write(
    "<li> " +
      i18n.t("finances.billManager.perPerson") +
      ": " +
      getCurrency(mean, currency, locale) +
      " </li></ul>"
  );
  myWindow.document.write(
    "<h2>" + i18n.t("finances.memberExpenses") + "</h2><ul>"
  );
  memberTotals.forEach(member => {
    myWindow.document.write(
      "<li>" +
        member.name +
        ": " +
        getCurrency(member.total / 100, currency, locale) +
        " </li>"
    );
  });
  myWindow.document.write("</ul>");

  if (memberDebts != undefined) {
    myWindow.document.write(
      "<h2>" + i18n.t("finances.export.memberDebts") + "</h2><ul>"
    );
    memberDebts.forEach(member => {
      myWindow.document.write(
        "<li>" +
          member.name +
          ": " +
          getCurrency(member.total / 100, currency, locale) +
          " </li>"
      );
    });
    myWindow.document.write("</ul>");
  }

  myWindow.document.write(
    "<h2>" +
      i18n.t("finances.export.results") +
      '</h2><table style="width:100%"><tr><th>' +
      i18n.t("finances.billManager.paying") +
      "</th><th>" +
      i18n.t("finances.billManager.receives") +
      "</th><th>" +
      i18n.t("finances.billManager.amount") +
      "</th></tr>"
  );
  debts.forEach(debt => {
    myWindow.document.write(
      "<tr><td>" +
        debt.paying +
        "</td><td>" +
        debt.receiving +
        "</td><td>" +
        getCurrency(debt.amount, currency, locale) +
        "</td></td>"
    );
  });
  myWindow.document.write(
    "</table><h6>Jeff - Organizer, 2020</h6></body>" + css + "</html>"
  );
  myWindow.document.close();
}

function getCurrency(val, cur, loc) {
  if (val == 0) {
    val = 0.0;
  }
  return new Intl.NumberFormat(loc || undefined, {
    style: "currency",
    currency: cur
  }).format(val);
}

export { exportToHTML };

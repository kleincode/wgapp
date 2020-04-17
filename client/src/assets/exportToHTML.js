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
    "WGApp - Compensation Payments",
    "toolbar=yes,scrollbars=yes,resizable=yes,width=700,height=900"
  );
  myWindow.document.write(
    '<html><head><link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"><title>WGApp - Compensation Payments</title></head><body><h1>Compensation Payments</h1><h3>' +
      lastBill +
      " until " +
      maxDate +
      '</h3><hr style="margin-bpottom: 15px">'
  );
  let css =
    "<style>body { font-family: 'Roboto', sans-serif; } table, th, td { border: 1px solid black; border-collapse: collapse;} table { border-spacing: 5px; } th, td {padding: 5px;}</style>";
  myWindow.document.write(
    "<h2>Expenses</h2> <ul><li><b>Total: " +
      getCurrency(total, currency, locale) +
      " </b></li>"
  );
  if (includeMonthlyCharges) {
    myWindow.document.write(
      "<li>Monthly Total: " +
        getCurrency(monthlyTotal, currency, locale) +
        "</li>"
    );
  }
  myWindow.document.write(
    "<li> Per Person: " + getCurrency(mean, currency, locale) + " </li></ul>"
  );
  myWindow.document.write("<h2>Member Expenses</h2><ul>");
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
    myWindow.document.write("<h2>Member Debts</h2><ul>");
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
    '<h2>Resulting Compensation Payments</h2><table style="width:100%"><tr><th>Paying</th><th>Receives</th><th>Amount</th></tr>'
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
    "</table><h6>WGApp, 2020</h6></body>" + css + "</html>"
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

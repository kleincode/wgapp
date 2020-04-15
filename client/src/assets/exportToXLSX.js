import zipcelx from "zipcelx";

function exportXLSX(lastBill, max, cur, loc, jsonData) {
  console.log(jsonData);
  let config = {
    filename: "bill" + max,
    sheet: {
      data: [
        [
          {
            value: "Compensation",
            type: "string"
          },
          {
            value: "Payments",
            type: "string"
          }
        ],
        [
          {
            value: lastBill,
            type: "string"
          },
          {
            value: "until",
            type: "string"
          },
          {
            value: max,
            type: "string"
          }
        ],
        [],
        [
          {
            value: "Expenses",
            type: "string"
          }
        ],
        [
          {},
          {
            value: "Total",
            type: "string"
          },
          {
            value: jsonData.total,
            type: "number"
          }
        ],
        [
          { value: "", type: "string" },
          {
            value: "Per Person",
            type: "string"
          },
          {
            value: jsonData.mean,
            type: "number"
          }
        ]
      ]
    }
  };
  if (jsonData.includeMonthlyCharges) {
    config.sheet.data.push([
      { value: "", type: "string" },
      {
        value: "Monthly total",
        type: "string"
      },
      {
        value: getCurrency(jsonData.monthlyTotal, cur, loc),
        type: "string"
      }
    ]);
  }
  config.sheet.data.push([]);
  config.sheet.data.push([
    {
      value: "Member Expenses",
      type: "string"
    }
  ]);
  jsonData.memberTotals.forEach(member => {
    config.sheet.data.push([
      { value: "", type: "string" },
      {
        value: member.name,
        type: "string"
      },
      {
        value: getCurrency(member.total / 100, cur, loc),
        type: "string"
      }
    ]);
  });
  config.sheet.data.push([]);
  if (jsonData.memberDebts != undefined) {
    config.sheet.data.push([
      {
        value: "Member Debts",
        type: "string"
      }
    ]);

    jsonData.memberDebts.forEach(member => {
      config.sheet.data.push([
        {
          value: "",
          type: "string"
        },
        {
          value: member.name,
          type: "string"
        },
        {
          value: getCurrency(member.total / 100, cur, loc),
          type: "string"
        }
      ]);
    });
    config.sheet.data.push([]);
  }

  config.sheet.data.push([
    {
      value: "Resulting Compensation Payments",
      type: "string"
    }
  ]);
  config.sheet.data.push([
    {
      value: "",
      type: "string"
    },
    {
      value: "Paying",
      type: "string"
    },
    {
      value: "Receiving",
      type: "string"
    },
    {
      value: "Amount",
      type: "string"
    }
  ]);

  jsonData.debts.forEach(member => {
    config.sheet.data.push([
      {
        value: "",
        type: "string"
      },
      {
        value: member.paying,
        type: "string"
      },
      {
        value: member.receiving,
        type: "string"
      },
      {
        value: getCurrency(member.amount, cur, loc),
        type: "string"
      }
    ]);
  });

  console.log(config);
  zipcelx(config);
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

export { exportXLSX };

import zipcelx from "zipcelx";
import i18n from "@/i18n";
import store from "../store";

function exportXLSX(lastBill, max, cur, loc, jsonData) {
  console.log(jsonData);
  let config = {
    filename: "bill" + max,
    sheet: {
      data: [
        [
          {
            value: i18n.t("finances.compensationPayments"),
            type: "string"
          }
        ],
        [
          {
            value: lastBill,
            type: "string"
          },
          {
            value: i18n.t("finances.export.until"),
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
            value: i18n.t("finances.expenses"),
            type: "string"
          }
        ],
        [
          {},
          {
            value: i18n.t("finances.billManager.total"),
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
            value: i18n.t("finances.billManager.perPerson"),
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
        value: i18n.t("finances.billManager.monthlyTotal"),
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
      value: i18n.t("finances.memberExpenses"),
      type: "string"
    }
  ]);
  jsonData.memberTotals.forEach(member => {
    config.sheet.data.push([
      { value: "", type: "string" },
      {
        value: store.getters.getFullUserName(member.name),
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
        value: i18n.t("finances.export.memberDebts"),
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
          value: store.getters.getFullUserName(member.name),
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
      value: i18n.t("finances.export.results"),
      type: "string"
    }
  ]);
  config.sheet.data.push([
    {
      value: "",
      type: "string"
    },
    {
      value: i18n.t("finances.billManager.paying"),
      type: "string"
    },
    {
      value: i18n.t("finances.billManager.receives"),
      type: "string"
    },
    {
      value: i18n.t("finances.billManager.amount"),
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
        value: store.getters.getFullUserName(member.paying),
        type: "string"
      },
      {
        value: store.getters.getFullUserName(member.receiving),
        type: "string"
      },
      {
        value: getCurrency(member.amount, cur, loc),
        type: "string"
      }
    ]);
  });
  config.sheet.data.push([]);
  config.sheet.data.push([
    {
      value: "Roomie - Organizer",
      type: "string"
    }
  ]);
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

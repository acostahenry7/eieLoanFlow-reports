function formatClientName(clientName) {
  let formatedName = "";
  let nameArr = clientName?.split(" ") || "";
  if (nameArr.length > 4) {
    formatedName = `${nameArr[0]} ${nameArr[1]} ${nameArr[2]} ${nameArr[3]}`;
  } else {
    formatedName = clientName;
  }

  return formatedName;
}

function getLoanSituationLabel(loanSituation) {
  let label = "";

  switch (loanSituation) {
    case "RENEGOTIATED":
      label = "Renegociado";
      break;
    case "NORMAL":
      label = "Normal";
      break;
    case "ARREARS":
      label = "Atraso";
      break;
    case "REFINANCE":
      label = "Refinanciado";
      break;
    case "CHANGE_PAYMENT_DATE":
      label = "Cambio de fecha";
      break;
    case "BAD_LOAN":
      label = "DEFINIR";
      break;
    case "TRANSFERRED":
      label = "Transferido";
      break;
    case "EDIT":
      label = "Editado";
      break;
    case "SEIZED":
      label = "Incautado";
      break;
    case "CREATED":
      label = "Creado";
      break;
    case "PAID":
      label = "Pagado";
      break;
    case "ACTIVE":
      label = "Vigente";
      break;
    case "COMPOST":
      label = "Abonado";
      break;
    case "DEFEATED":
      label = "Vencido";
      break;
    case "LOAN":
      label = "Préstamo";
      break;
    case "QUICK_LOAN":
      label = "Préstamo Rápido";
      break;
    case "DISCOUNT_MORA":
      label = "Descuento de mora";
      break;
    case "MODIFY_MORA":
      label = "Mora modificada";
      break;
    case "DISCOUNT_INTEREST":
      label = "Descuento de interes";
      break;
    case "CAPITAL_PAYMENT":
      label = "Abono a capital";
      break;
    case "GLOBAL_DISCOUNT":
      label = "Descuento global";
      break;
    case "CANCEL_PAYMENT":
      label = "Pago cancelado";
      break;
    default:
      break;
  }

  return label;
}

function getLoanTypeLabel(loanType) {
  let label = "";

  switch (loanType) {
    case "LOAN_EMPLOYEE":
      label = "Empleado";
      break;
    case "LOAN_PYMES":
      label = "Pymes";
      break;
    case "LOAN_TYPE_VEHICLE":
      label = "Vehículos";
      break;
    case "LOAN_TYPE_PERSONAL":
      label = "Personal";
      break;
    case "LOAN_TYPE_MORTGAGE":
      label = "Hipotecario";
      break;
    case "LOAN_INSURANCE":
      label = "Seguros";
      break;
    case "LOAN_MICRO":
      label = "Micro";
      break;
    default:
      break;
  }

  return label;
}

function getPaymentTypeLabel(paymentType) {
  let result = "";
  switch (paymentType) {
    case "CASH":
      result = "Efectivo";
      break;
    case "CHECK":
      result = "Cheque";
      break;
    case "TRANSFER":
      result = "Transferencia";
      break;
    default:
      result = "Efectivo";
      break;
  }

  return result;
}

function getLabelByTransactionType(paymentType) {
  let result = "";
  switch (paymentType) {
    case "DISBURSEMENT":
      result = "Desembolso";
      break;
    case "ENTRY":
      result = "Depósito";
      break;
    case "RETIREMENT":
      result = "Retiro";
      break;
    case "PAYMENT":
      result = "Pago";
      break;
    default:
      break;
  }

  return result;
}

function getLoanFrequencyLabel(key) {
  let result = "";

  switch (key) {
    case "DAILY":
      result = "Diario";
      break;
    case "INTER_DAY":
      result = "Inter-diario";
      break;
    case "MONTHLY":
      result = "Mensual";
      break;
    case "BEWEEKLY":
      result = "Quincenal";
      break;
    case "WEEKLY":
      result = "Semanal";
      break;

    default:
      break;
  }
  return result;
}

function getCustomerEstatusLabel(key) {
  let result = "";

  switch (key) {
    case "ENABLED":
      result = "Activo";
      break;
    case "DISABLED":
      result = "Inactivo";
      break;
    default:
      break;
  }
  return result;
}

export function getPaymentTotalByType(arr, type) {
  let totalCash = 0;
  arr.map(function (item) {
    item.child
      .filter((a) => a.status_type == "ENABLED" && a.payment_type == type)
      .map((c) => {
        totalCash += parseFloat(c.pay);
      });
  });

  return totalCash;
}

function getTotalPaymentDiscount(arr) {
  let discount = 0;

  // discount += arr.reduce(
  //   (acc, item) => acc + parseFloat(item.register.total_discount || 0),
  //   0
  // );

  discount += arr.reduce((acc, item) => {
    let rowTotal = item.child?.reduce(
      (inAcc, inItem) =>
        inAcc +
        //parseFloat(inItem.pay_off_loan_discount || 0) +
        parseFloat(inItem.loan_discount),
      0
    );

    return acc + rowTotal;
  }, 0);

  return discount;
}

export {
  formatClientName,
  getLoanSituationLabel,
  getLoanTypeLabel,
  getPaymentTypeLabel,
  getTotalPaymentDiscount,
  getLoanFrequencyLabel,
  getCustomerEstatusLabel,
  getLabelByTransactionType,
};

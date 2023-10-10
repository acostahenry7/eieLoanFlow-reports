const db = require("../models");
const { generateWhereStatement } = require("../utils");

const controller = {};

controller.getTodayPayments = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, c.phone, l.amount_approved,
        MIN(a.quota_number) filter(where a.paid = 'false') as pending_due,  l.amount_of_free, 
        MIN(a.payment_date) filter(where a.paid = 'false') as payment_date
        FROM customer_loan cl
        JOIN customer c ON (cl.customer_id = c.customer_id)
        JOIN loan l ON (cl.loan_id = l.loan_id)
        JOIN amortization a ON (a.loan_id = l.loan_id)
        GROUP BY c.first_name, c.last_name, l.status_type,  c.identification, c.phone, l.loan_number_id, 
        l.created_date, l.amount_approved, l.amount_of_free,  l.outlet_id
        HAVING l.status_type not in ('DELETE', 'PAID')
        ${generateWhereStatement(queryParams)}`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

controller.getCanceledPayments = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, r.receipt_number, 
      e.first_name || ' ' || e.last_name as employee_name, p.last_modified_date, p.comment, p.status_type
      FROM payment p
      JOIN customer_loan cl ON (p.loan_id = cl.loan_id)
      JOIN customer c ON (cl.customer_id = c.customer_id)
      JOIN loan l ON (p.loan_id = l.loan_id)
      JOIN receipt r ON (r.payment_id = p.payment_id)
      JOIN jhi_user ju ON (p.created_by = ju.login)
      JOIN employee e ON (ju.employee_id = e.employee_id)
      WHERE p.status_type = 'CANCEL' 
      AND l.status_type not in ('DELETE', 'PAID')
      ${generateWhereStatement(queryParams)}`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

controller.getReceivedPayments = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, p.created_by, p.payment_type,
      l.loan_number_id, p.created_date, p.payment_origin, r.receipt_number, p.status_type,
      STRING_AGG(a.quota_number::varchar , ', ') filter(where a.paid='true') as paid_dues,
      STRING_AGG(a.quota_number::varchar , ', ') filter(where a.status_type='COMPOST') as compost_dues,
      SUM(a.discount_mora + a.discount_interest) as discount,
      SUM(a.total_paid_mora) as total_paid_mora,
      p.pay
      FROM payment p
      JOIN payment_detail pd on (p.payment_id = pd.payment_id)
      JOIN amortization a on (pd.amortization_id = a.amortization_id)
      JOIN loan l on (p.loan_id = l.loan_id)
      JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
      JOIN customer c ON (la.customer_id = c.customer_id)
      LEFT JOIN receipt r ON (p.payment_id = r.payment_id)
      GROUP BY c.first_name, c.last_name, c.identification, l.loan_number_id, p.created_by, p.payment_type, p.created_date,
      p.payment_origin, p.pay, l.status_type, l.outlet_id,r.receipt_number, p.status_type
      HAVING l.status_type not in ('DELETE', 'PAID')
      ${generateWhereStatement(queryParams)}`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

controller.getPaymentProyection = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT l.loan_number_id, z.name as zone, e.first_name || ' ' || e.last_name as employee_name,
      COALESCE(SUM(a.total_paid + a.total_paid_mora) filter(where a.paid='true'),0) as paid_amount,
      COALESCE(SUM(a.amount_of_fee + a.mora) filter(where a.paid='false'),0) as pending_amount,
      TRUNC(COALESCE((SUM(a.total_paid + a.total_paid_mora) filter(where a.paid='true')/SUM(a.amount_of_fee + a.mora)),0) * 100, 2) - 8.5 as payment_proyection,
      TRUNC(COALESCE((SUM(a.total_paid + a.total_paid_mora) filter(where a.paid='true')/SUM(a.amount_of_fee + a.mora)),0) * 100, 2) as efficiency
      FROM loan l
      JOIN loan_payment_address lpa ON (l.loan_payment_address_id = lpa.loan_payment_address_id)
      JOIN zone z ON (lpa.municipality_id = z.municipality_id)
      JOIN employee_zone ez ON (z.zone_id = ez.zone_id)
      JOIN employee e ON (ez.employee_id = e.employee_id)
      JOIN amortization a ON (l.loan_id = a.loan_id)
      GROUP BY l.loan_number_id, z.name, e.first_name, e.last_name, l.status_type
      HAVING l.status_type NOT IN ('PAID', 'DELETE')`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

controller.getHistoryPaymentControl = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, r.receipt_number, 
      e.first_name || ' ' || e.last_name as employee_name, p.status_type, pcc.comment_type,
      pcc.created_date as comment_date, pcc.comment, pcc.letters_sent_type as letter_type, pcc.commitment_date
      FROM payment p
      JOIN payment_control_comment pcc ON (p.loan_id = pcc.loan_id)
      JOIN customer_loan cl ON (p.loan_id = cl.loan_id)
      JOIN customer c ON (cl.customer_id = c.customer_id)
      JOIN loan l ON (p.loan_id = l.loan_id)
      JOIN receipt r ON (r.payment_id = p.payment_id)
      JOIN jhi_user ju ON (p.created_by = ju.login)
      JOIN employee e ON (ju.employee_id = e.employee_id)
      AND l.status_type not in ('DELETE', 'PAID')
      ${generateWhereStatement(queryParams)}`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;

import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getLoans } from "../../../api/loan";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import "./index.css";

function LoanDetailCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const customers = await getLoans(searchParams);
        if (customers.error == true) {
          throw new Error(customers.body);
        }
        console.log(customers.body);
        setOutlets(outlets.body);
        setData(customers.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    {
      name: "Cliente",
      width: "250px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.customer_name)}
          </p>
          <span style={{ fontSize: 12 }}>{row.identification}</span>
        </div>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Préstamo",
      width: "120px",
      selector: (row) => row.loan_number_id,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Sucursal",
      width: "140px",
      selector: (row) => row.outlet_name,
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Tipo de préstamo",
      selector: (row) => row.loan_type,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto aprobado",
      selector: (row) => row.amount_approved,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total",
      selector: (row) => row.total_amount,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Cantidad de cuotas",
      selector: (row) => row.number_of_installments,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto de cuota",
      selector: (row) => row.due_amount,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estado",
      selector: (row) =>
        row.status_type === "CANCEL" ? "Cancelado" : "Activo",
      sortable: true,
      reorder: true,
      omit: false,
      hide: "lg",
    },
    {
      name: "Situación",
      selector: (row) => row.loan_situation,
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

  const mainFilters = [
    {
      label: "Cliente",
      field: "customerName",
      placeholder: "Búsqueda por nombre",
      type: "text",
    },
    {
      label: "No. Cédula/Pasaporte",
      field: "indetification",
      placeholder: "Cédula",
      type: "text",
    },
    {
      label: "No. Préstamo",
      field: "loanNumber",
      placeholder: "No. Préstamo",
      type: "text",
    },
    {
      label: "Sucursal",
      field: "outletId",
      type: "select",
      options: [
        {
          label: "Todas las sucursales",
          value: "",
        },
        ...outlets.map((item) => {
          return {
            label: item.name,
            value: item.outlet_id,
          };
        }),
      ],
    },
  ];

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}indetification${item.identification}loanNumber${item.loan_number_id}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  return (
    <div className="crud-container">
      <SearchBar
        mainFilters={mainFilters}
        setRequestToggle={setReqToggle}
        setSearchParams={setSearchParams}
        setSearchedText={setSearchedText}
        columns={columns}
        setColumns={setColumns}
      />
      <Datatable
        columns={columns}
        data={filterData}
        isLoading={isLoading}
        dtOptions={{
          expandableRows: true,
          expandableRowsComponent: ({ data }) => {
            return <LoanDetailSummary data={data} />;
          },
        }}
      />
    </div>
  );
}

function LoanDetailSummary({ data }) {
  const fields = [
    "Nombre Cliente",
    "Cédula",
    "Préstamo",
    "Tipo de tasa",
    "Monto aprobado",
    "Número de cuotas",
    "Porcentaje",
    "Frecuencia de pago",
    "Tipo de mora",
    "Estado",
    "Situación",
    "Tipo de préstamo",
    "Capital pagado",
    "Interés pagado",
    "Descuento de interés",
    "Descuenot de mora",
    "Mora",
    "Mora pagada",
    "Total pagado",
    "Total en atraso",
    "Cuotas pagadas",
    "Total",
    "Interés",
    "Monto de cuota",
    "Monto pendiente",
    "Capital pendiente",
    "Interés pendiente",
    "Mora pendiente",
    "Mora en atraso",
    "Cuotas pendientes",
    "Cuotas en atraso",
    "Sucursal",
  ];

  return (
    <div className="LoanDetailSummary-container">
      {Object.entries(data).map((item, index) => (
        <div className="LoanDetailSummary-item">
          <p>{fields[index] || "key"} :</p>
          <p> {item[1]}</p>
        </div>
      ))}
    </div>
  );
}

export { LoanDetailCrud };

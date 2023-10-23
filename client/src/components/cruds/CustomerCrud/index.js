import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getArrearCustomersApi } from "../../../api/customer";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";

function CustomerCrud() {
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
        const customers = await getArrearCustomersApi(searchParams);
        if (customers.error == true) {
          throw new Error(customers.body);
        }

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
      width: "230px",
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
      selector: (row) => row.loan_number_id,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Teléfono",
      selector: (row) => row.phone,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha Préstamo",
      selector: (row) => row.created_date,
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
      name: "Monto cuota",
      selector: (row) => row.amount_of_free,
      sortable: true,
      reorder: true,
      omit: false,
      hide: "lg",
    },
    {
      name: "Cuotas",
      selector: (row) => row.number_of_installments,
      sortable: true,
      reorder: true,
      omit: false,
      hide: "lg",
    },
    {
      name: "Cuotas Pagadas",
      selector: (row) => row.paid_dues,
      sortable: true,
      reorder: true,
      omit: false,
      hide: "lg",
    },
    {
      name: "Cuotas en atraso",
      selector: (row) => row.arrears_dues,
      sortable: true,
      reorder: true,
      omit: false,
      hide: "lg",
    },
    {
      name: "Porcentaje atraso",
      selector: (row) => (
        <p
          style={{
            color:
              parseFloat(row.arrear_percentaje) > 50 ? "#b25353" : "#d7a12a",
            fontWeight: "bold",
          }}
        >
          {parseFloat(row.arrear_percentaje).toFixed(2)} %
        </p>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const a = parseFloat(rowA.arrear_percentaje) || 0;
        const b = parseFloat(rowB.arrear_percentaje) || 0;

        if (a > b) {
          return 1;
        }

        if (b > a) {
          return -1;
        }

        return 0;
      },
      reorder: true,
      omit: false,
    },
    {
      name: "Vencido desde",
      selector: (row) => row.defeated_since,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto Vencido",
      selector: (row) => row.defeated_amount,
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

  const secondaryFilters = [
    // {
    //   label: "Cliente",
    //   field: "customerName",
    //   placeholder: "Búsqueda por nombre",
    //   type: "text",
    // },
    {
      label: "Fecha del Préstamo",
      field: "date",
      type: "dateRange",
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
        secondaryFilters={secondaryFilters}
        setRequestToggle={setReqToggle}
        setSearchParams={setSearchParams}
        setSearchedText={setSearchedText}
        columns={columns}
        setColumns={setColumns}
      />
      <Datatable columns={columns} data={filterData} isLoading={isLoading} />
    </div>
  );
}

export { CustomerCrud };

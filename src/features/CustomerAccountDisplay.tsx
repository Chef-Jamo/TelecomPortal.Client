import { type GridColDef } from "@mui/x-data-grid";
import type { CustomerAccountDto } from "../models/CustomerAccountDto";
import { ServerGrid_Mui } from "../components/ServerGrid_Mui";
import { getAllCustomerAccounts } from "../services/CustomerAccountService";
import { useEffect, useRef, useState } from "react";
import { handleError, showInfo } from "../Utilities/Toast";

const columns: GridColDef[] = [
  { field: "fullName", headerName: "Full Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
  {
    field: "isActive",
    headerName: "Active",
    flex: 0.5,
    type: "boolean",
    valueFormatter: (params) => (params ? "Yes" : "No"),
  },
];

export const CustomerAccountDisplay = () => {
  const [rows, setRows] = useState<CustomerAccountDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const didFetch = useRef(false);

  const handleCustomerAccountDisplay = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCustomerAccounts();
      console.log("Customer accounts response:", response);
      if (!response || !response.data || response.data.length === 0) {
        showInfo("No customer accounts found.");
        setRows([]);
      } else {
        setRows(response.data);
      }
    } catch (error) {
      handleError(error);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      handleCustomerAccountDisplay();
      didFetch.current = true;
    }
  }, []);

  return (
    <ServerGrid_Mui
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      isLoading={isLoading}
    />
  );
};

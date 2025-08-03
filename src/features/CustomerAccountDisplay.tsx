import { type GridColDef } from "@mui/x-data-grid";
import type { CustomerAccountDto } from "../models/CustomerAccountDto";
import { ServerGrid_Mui } from "../components/ServerGrid_Mui";
import { getAllCustomerAccounts } from "../services/CustomerAccountService";
import { useEffect, useState } from "react";
import { handleError } from "../Utilities/Toast";

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

  const handleCustomerAccountDisplay = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCustomerAccounts();
      setRows(response.data);
    } catch (error) {
      handleError(error);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCustomerAccountDisplay();
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

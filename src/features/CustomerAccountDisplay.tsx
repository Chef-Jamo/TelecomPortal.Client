import { type GridColDef } from "@mui/x-data-grid";
import type { CustomerAccountDto } from "../models/CustomerAccountDto";
import { ServerGrid_Mui } from "../components/ServerGrid_Mui";
import {
  createCustomerAccount,
  getAllCustomerAccounts,
  updateCustomerAccount,
} from "../services/CustomerAccountService";
import { useEffect, useRef, useState } from "react";
import { handleError, showInfo, showSuccess } from "../Utilities/Toast";

const columns: GridColDef[] = [
  { field: "fullName", headerName: "Full Name", flex: 1, editable: true },
  { field: "email", headerName: "Email", flex: 1, editable: true },
  { field: "phoneNumber", headerName: "Phone Number", flex: 1, editable: true },
  {
    field: "isActive",
    headerName: "Active",
    flex: 0.5,
    type: "boolean",
    valueFormatter: (params) => (params ? "Yes" : "No"),
    editable: true,
  },
];

const createRowTemplate: CustomerAccountDto = {
  id: 0,
  fullName: "",
  email: "",
  phoneNumber: "",
  isActive: false,
};

export const CustomerAccountDisplay = () => {
  const [rows, setRows] = useState<CustomerAccountDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const didFetch = useRef(false);

  const handleCustomerAccountDisplay = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCustomerAccounts();
      if (response) {
        setRows(response);
      } else {
        showInfo("No customer accounts found.");
        setRows([]);
      }
    } catch (error) {
      handleError(error);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (
    newRow: CustomerAccountDto,
    oldRow: CustomerAccountDto
  ) => {
    try {
      debugger;
      const updated = await updateCustomerAccount(newRow);
      if (updated) {
        showSuccess("Customer account updated successfully.");
      }
      setRows((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row))
      );
      return updated;
    } catch (error) {
      handleError(error);
      return oldRow;
    }
  };

  const handleCreate = async (
    newRow: CustomerAccountDto & { isNew?: boolean }
  ) => {
    try {
      const { isNew, ...payload } = { ...newRow, id: 0 };
      const created = await createCustomerAccount(payload);
      if (created) {
        showSuccess("Customer account created successfully.");
        setRows((prev) => [created, ...prev]);
        return created;
      }
      return newRow;
    } catch (error) {
      handleError(error);
      return newRow;
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
      onRowUpdate={handleUpdate}
      onRowCreate={handleCreate}
      createRowTemplate={createRowTemplate}
    />
  );
};

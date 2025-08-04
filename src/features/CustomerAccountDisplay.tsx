import { type GridColDef } from "@mui/x-data-grid";
import type { CustomerAccountDto } from "../models/CustomerAccountDto";
import { ServerGrid_Mui } from "../components/ServerGrid_Mui";
import {
  createCustomerAccount,
  deleteCustomerAccount,
  getAllCustomerAccounts,
  updateCustomerAccount,
} from "../services/CustomerAccountService";
import { useEffect, useRef, useState } from "react";
import {
  handleError,
  showError,
  showInfo,
  showSuccess,
} from "../Utilities/Toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

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
  const [selectedRow, setSelectedRow] = useState<CustomerAccountDto | null>(
    null
  );

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleDelete = async (row: CustomerAccountDto) => {
    handleClickOpen();
    setSelectedRow(row);
  };

  const hadndleConfirmDelete = async () => {
    if (selectedRow) {
      try {
        debugger;
        const response = await deleteCustomerAccount(selectedRow.id);
        if (response) {
          showSuccess("Customer account deleted successfully.");
          setRows((prev) => prev.filter((row) => row.id !== selectedRow.id));
        } else {
          showError("Failed to delete customer account.");
        }
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
        setSelectedRow(null);
      }
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      handleCustomerAccountDisplay();
      didFetch.current = true;
    }
  }, []);

  return (
    <>
      <ServerGrid_Mui
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        onRowUpdate={handleUpdate}
        onRowCreate={handleCreate}
        onRowDelete={handleDelete}
        createRowTemplate={createRowTemplate}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>
          {"You sure you want to delete this Customer Account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={hadndleConfirmDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

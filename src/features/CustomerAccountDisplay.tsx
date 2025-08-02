import { type GridColDef } from "@mui/x-data-grid";
import type { CustomerAccountDto } from "../models/CustomerAccountDto";
import { ServerGrid_Mui } from "../components/ServerGrid_Mui";

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
const rows: CustomerAccountDto[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    isActive: true,
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "098-765-4321",
    isActive: false,
  },
];

export const CustomerAccountDisplay = () => {
  return (
    <ServerGrid_Mui rows={rows} columns={columns} getRowId={(row) => row.id} />
  );
};

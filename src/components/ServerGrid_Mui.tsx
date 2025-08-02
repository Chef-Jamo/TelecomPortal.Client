import { Button, TextField } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, type ChangeEvent } from "react";

export interface ServerGridMuiProps<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
}

export function ServerGrid_Mui<T>({
  rows,
  columns,
  getRowId,
}: ServerGridMuiProps<T>) {
  const [search, setSearch] = useState("");

  const filteredRows = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ height: "calc(100vh - (64px + 52px))", width: "100%" }}>
      <div className='flex justify-start items-center mb-2 gap-2'>
        <TextField
          variant='outlined'
          placeholder='Search...'
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          size='small'
          className='w-60 bg-white dark:bg-gray-900 rounded'
        />
        {search && (
          <Button
            onClick={() => setSearch("")}
            variant='outlined'
            size='small'
            className='ml-1 rounded border-gray-300 bg-gray-100 dark:bg-gray-800 text-base'
            style={{ textTransform: "none" }}>
            Clear
          </Button>
        )}
      </div>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={getRowId}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </div>
  );
}

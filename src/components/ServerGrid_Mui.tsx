import { Button, TextField } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridRowModes,
  type GridRowModesModel,
} from "@mui/x-data-grid";
import { useEffect, useState, type ChangeEvent } from "react";

export interface ServerGridMuiProps<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
  isLoading?: boolean;
  onRowUpdate?: (newRow: T, oldRow: T) => Promise<T> | T | void;
}

export function ServerGrid_Mui<T>({
  rows,
  columns,
  getRowId,
  isLoading = true,
  onRowUpdate,
}: ServerGridMuiProps<T>) {
  const [search, setSearch] = useState("");
  const filteredRows = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );
  const [localRows, setLocalRows] = useState<T[]>(rows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const processRowUpdate = async (newRow: any, oldRow: any) => {
    if (onRowUpdate) {
      const result = await onRowUpdate(newRow, oldRow);
      if (result) {
        setLocalRows((prev) =>
          prev.map((row) => (getRowId(row) === getRowId(newRow) ? result : row))
        );
        return result;
      }
    }
    setLocalRows((prev) =>
      prev.map((row) => (getRowId(row) === getRowId(newRow) ? newRow : row))
    );
    return newRow;
  };

  const handleRowDoubleClick = (params: any) => {
    setRowModesModel((prev) => ({
      ...prev,
      [params.id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleRowEditStop = (params: any, event: any) => {
    setRowModesModel((prev) => ({
      ...prev,
      [params.id]: { mode: GridRowModes.View },
    }));
  };

  return (
    <div className='w-full'>
      <div className='flex justify-start items-center mb-2 gap-2'>
        <TextField
          variant='outlined'
          placeholder='Search...'
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          size='small'
          className='w-60 bg-white dark:bg-gray-400 rounded'
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
      <div className='w-full max-h-[600px] min-h-[300px] overflow-y-auto'>
        <DataGrid
          loading={isLoading}
          rows={filteredRows}
          columns={columns}
          getRowId={getRowId}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          processRowUpdate={processRowUpdate}
          rowModesModel={rowModesModel}
          onRowDoubleClick={handleRowDoubleClick}
          onRowEditStop={handleRowEditStop}
          editMode='row'
          sx={{
            height: "100%",
            minHeight: 300,
            maxHeight: 600,
            "& .MuiDataGrid-virtualScroller": {
              overflowY: "auto",
              maxHeight: 600,
            },
          }}
        />
      </div>
    </div>
  );
}

import { Button, TextField } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridEventListener,
  GridRowEditStopReasons,
  type GridRowId,
  GridRowModes,
  type GridRowModesModel,
} from "@mui/x-data-grid";
import { useEffect, useState, type ChangeEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { randomId } from "@mui/x-data-grid-generator";

export interface ServerGridMuiProps<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
  isLoading?: boolean;
  onRowUpdate?: (newRow: T, oldRow: T) => Promise<T> | T | void;
  onRowCreate?: (newRow: T) => Promise<T> | T | void;
  onRowDelete?: (row: T) => Promise<void> | void;
  createRowTemplate?: T;
}

export function ServerGrid_Mui<T>({
  rows,
  columns,
  getRowId,
  isLoading = true,
  onRowUpdate,
  onRowCreate,
  onRowDelete,
  createRowTemplate,
}: ServerGridMuiProps<T>) {
  const [search, setSearch] = useState("");
  const [localRows, setLocalRows] = useState<T[]>(rows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const filteredRows = localRows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClick = () => {
    if (!createRowTemplate) return;
    const id = randomId();
    setLocalRows((oldRows) => [
      { ...createRowTemplate, id, isNew: true } as T,
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: {
        mode: GridRowModes.Edit,
        fieldToFocus: Object.keys(createRowTemplate)[0],
      },
    }));
  };

  const processRowUpdate = async (newRow: any, oldRow: any) => {
    if (newRow.isNew && onRowCreate) {
      const created = await onRowCreate({ ...newRow, id: "" });
      if (created) {
        setLocalRows((prev) =>
          prev.map((row) =>
            getRowId(row) === getRowId(newRow) ? created : row
          )
        );
        return { ...created, isNew: false };
      }
    }
    if (onRowUpdate) {
      const updated = await onRowUpdate(newRow, oldRow);
      if (updated) {
        setLocalRows((prev) =>
          prev.map((row) =>
            getRowId(row) === getRowId(newRow) ? updated : row
          )
        );
        return { ...updated, isNew: false };
      }
    }
    setLocalRows((prev) =>
      prev.map((row) =>
        getRowId(row) === getRowId(newRow) ? { ...newRow, isNew: false } : row
      )
    );
    return { ...newRow, isNew: false };
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setLocalRows((prev) => prev.filter((row) => getRowId(row) !== id));
    onRowDelete?.(localRows.find((row) => getRowId(row) === id) as T);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
    const editedRow = localRows.find((row) => getRowId(row) === id);
    if ((editedRow as any)?.isNew) {
      setLocalRows((prev) => prev.filter((row) => getRowId(row) !== id));
    }
  };

  const columnActionItems: GridColDef[] = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              onClick={handleSaveClick(id)}
              color='primary'
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />,
        ];
      },
    },
  ];

  return (
    <div className='w-full'>
      <div className='flex items-center mb-2 gap-2'>
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
        <div className='flex-1' />
        {createRowTemplate && (
          <Button
            onClick={handleAddClick}
            variant='contained'
            size='small'
            className='rounded-full min-w-0 w-9 h-9 flex items-center justify-center bg-blue-600 text-white'
            style={{ textTransform: "none", padding: 0 }}>
            <AddIcon />
          </Button>
        )}
      </div>
      <div className='w-full max-h-[600px] min-h-[300px] overflow-y-auto'>
        <DataGrid
          loading={isLoading}
          rows={filteredRows}
          columns={columnActionItems}
          getRowId={getRowId}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
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

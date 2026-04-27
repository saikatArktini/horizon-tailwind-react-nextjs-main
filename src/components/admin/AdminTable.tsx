"use client";

import React, { useState } from "react";
import Card from "components/card";
import { Button } from "@mui/material";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import AssignBranchDialog from "components/AssignBranchDialog";
import RemoveBranchDialog from "components/RemoveBranchDialog";
// import CreateEditAdminDialog from "components/CreateEditAdminDialog";

type AdminRow = {
  id: number;
  username: string;
  role: string;
  branches: number[];
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<AdminRow>();

export default function AdminTable({
  tableData,
  reload,
}: {
  tableData: AdminRow[];
  reload: () => void;
}) {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null);
  const [action, setAction] = useState<"assign" | "remove" | "edit" | null>(null);

  const columns = [
    columnHelper.accessor("username", {
      header: () => <p className="text-sm font-bold">USERNAME</p>,
      cell: info => (
        <p className="font-semibold">{info.getValue()}</p>
      ),
    }),

    columnHelper.accessor("role", {
      header: () => <p className="text-sm font-bold">ROLE</p>,
      cell: info => info.getValue(),
    }),

    columnHelper.accessor("createdAt", {
      header: () => <p className="text-sm font-bold">CREATED</p>,
      cell: info => info.getValue(),
    }),

    columnHelper.display({
      id: "actions",
      header: () => <p className="text-sm font-bold">ACTIONS</p>,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setSelectedAdmin(row.original);
              setAction("assign");
            }}
          >
            Assign
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              setSelectedAdmin(row.original);
              setAction("remove");
            }}
          >
            Remove
          </Button>

          {/* 
          <Button
            size="small"
            color="success"
            variant="outlined"
            onClick={() => {
              setSelectedAdmin(row.original);
              setAction("edit");
            }}
          >
            Edit
          </Button>
          */}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card extra="w-full p-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-bold">All Admins</h3>
      </header>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className="border-b py-2 text-left text-xs"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-3">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialogs (unchanged logic) */}
      {action === "assign" && selectedAdmin && (
        <AssignBranchDialog
          admin={selectedAdmin}
          onClose={() => setAction(null)}
          onSuccess={reload}
        />
      )}

      {action === "remove" && selectedAdmin && (
        <RemoveBranchDialog
          admin={selectedAdmin}
          onClose={() => setAction(null)}
          onSuccess={reload}
        />
      )}

      {/* {action === "edit" && selectedAdmin && (
        <CreateEditAdminDialog
          admin={selectedAdmin}
          onClose={() => setAction(null)}
          onSuccess={reload}
        />
      )} */}
    </Card>
  );
}

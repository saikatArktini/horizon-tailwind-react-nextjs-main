'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from 'components/card';
import { Button } from '@mui/material';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type RowObj = {
  branchId: number;
  name: [string, boolean];
  code: string;
  city: string;
  level: string;
  country: string;
  state: string;
  date: string;
};

const columnHelper = createColumnHelper<RowObj>();

export default function BranchesTable({
  tableData,
}: {
  tableData: RowObj[];
}) {
  const router = useRouter();

  const columns = [
    columnHelper.accessor('name', {
      header: () => <p className="text-sm font-bold">BRANCH</p>,
      cell: (info) => (
        <p className="font-semibold">{info.getValue()[0]}</p>
      ),
    }),

    columnHelper.accessor('code', {
      header: () => <p className="text-sm font-bold">CODE</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('city', {
      header: () => <p className="text-sm font-bold">CITY</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('level', {
      header: () => <p className="text-sm font-bold">LEVEL</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('country', {
      header: () => <p className="text-sm font-bold">COUNTRY</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('state', {
      header: () => <p className="text-sm font-bold">STATE</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: 'edit',
      header: () => <p className="text-sm font-bold">EDIT</p>,
      cell: ({ row }) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            router.push(`/admin/branch/edit/${row.original.branchId}`)
          }
        >
          Edit
        </Button>
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
        <h3 className="text-xl font-bold">All Branches</h3>
      </header>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
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
    </Card>
  );
}

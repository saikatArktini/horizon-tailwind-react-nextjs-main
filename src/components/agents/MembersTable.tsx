// 'use client';

// import React from 'react';
// import Card from 'components/card';
// import CardMenu from 'components/card/CardMenu';
// import Checkbox from 'components/checkbox';
// import { Button } from '@mui/material';

// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from '@tanstack/react-table';

// type RowObj = {
//   // name: [string, boolean];
//   // branch: string;
//   // role: string;
//   // status: 'Active' | 'Inactive';
//   // date: string;
//   memberId: string; // INTERNAL ID (used for verification)
//   name: [string, boolean];
//   branch: string;
//   role: string;
//   status: string;
//   date: string;
// };

// const columnHelper = createColumnHelper<RowObj>();

// export default function MembersTable({ tableData }: { tableData: RowObj[] }) {
//   const [data, setData] = React.useState<RowObj[]>(tableData);

//   const toggleStatus = (rowIndex: number) => {
//     setData((prev) =>
//       prev.map((row, i) =>
//         i === rowIndex
//           ? {
//               ...row,
//               status: row.status === 'Active' ? 'Inactive' : 'Active',
//             }
//           : row
//       )
//     );
//   };

//   const columns = [
//     columnHelper.accessor('name', {
//       header: () => <p className="text-sm font-bold">MEMBER</p>,
//       cell: (info) => (
//         <div className="flex items-center">
//           {/* <Checkbox defaultChecked={info.getValue()[1]} color="indigo" /> */}
//           <p className=" font-semibold">{info.getValue()[0]}</p>
//         </div>
//       ),
//     }),

//     columnHelper.accessor('branch', {
//       header: () => <p className="text-sm font-bold">BRANCH</p>,
//       cell: (info) => info.getValue(),
//     }),

//     columnHelper.accessor('role', {
//       header: () => <p className="text-sm font-bold">ROLE</p>,
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('memberId', {
//       header: () => <p className="text-sm font-bold">MEMBER ID</p>,
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('status', {
//       header: () => <p className="text-sm font-bold">STATUS</p>,
//       cell: (info) => (
//         <span
//           className={`rounded-full px-3 py-1 text-xs font-bold ${
//             info.getValue() === 'Active'
//               ? 'bg-green-100 text-green-700'
//               : 'bg-red-100 text-red-700'
//           }`}
//         >
//           {info.getValue()}
//         </span>
//       ),
//     }),

//     columnHelper.display({
//       id: 'action',
//       header: () => <p className="text-sm font-bold">ACTION</p>,
//       cell: ({ row }) => (
//         <Button
//           size="small"
//           variant="outlined"
//           color={row.original.status === 'Active' ? 'error' : 'success'}
//           onClick={() => toggleStatus(row.index)}
//         >
//           {row.original.status === 'Active' ? 'Deactivate' : 'Activate'}
//         </Button>
//       ),
//     }),
//   ];

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <Card extra="w-full p-6">
//       <header className="flex items-center justify-between">
//         <h3 className="text-xl font-bold">All Members</h3>
//         {/* <CardMenu /> */}
//       </header>

//       <div className="mt-6 overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             {table.getHeaderGroups().map((hg) => (
//               <tr key={hg.id}>
//                 {hg.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     className="border-b py-2 text-left text-xs"
//                   >
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>

//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} className="py-3">
//                     {flexRender(
//                       cell.column.columnDef.cell,
//                       cell.getContext()
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// }
'use client';

import React from 'react';
import Card from 'components/card';
import CardMenu from 'components/card/CardMenu';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type RowObj = {
  memberId: string; // memberCode
  name: [string, boolean];
  branch: string;
  role: string;
  status: string; // "Active" | "Inactive"
  date: string;
};

const columnHelper = createColumnHelper<RowObj>();

export default function MembersTable({ tableData }: { tableData: RowObj[] }) {
  const router = useRouter();
  const [data, setData] = React.useState<RowObj[]>(tableData);
  const [loadingRow, setLoadingRow] = React.useState<string | null>(null);

  const toggleStatus = async (row: RowObj) => {
    const token = localStorage.getItem("token");
    try {
      setLoadingRow(row.memberId);

      const newStatus =
        row.status === 'Active' ? 'Inactive' : 'Active';

      // map status name → statusId
      const statusId = newStatus === 'Active' ? 1 : 2;

      const res = await fetch(`/api/members/${row.memberId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,      
        },
        body: JSON.stringify({ statusId }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      // update UI only after success
      setData((prev) =>
        prev.map((r) =>
          r.memberId === row.memberId
            ? { ...r, status: newStatus }
            : r
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update member status');
    } finally {
      setLoadingRow(null);
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: () => <p className="text-sm font-bold">MEMBER</p>,
      cell: (info) => (
        <p className="font-semibold">{info.getValue()[0]}</p>
      ),
    }),

    columnHelper.accessor('branch', {
      header: () => <p className="text-sm font-bold">BRANCH</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('role', {
      header: () => <p className="text-sm font-bold">ROLE</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('memberId', {
      header: () => <p className="text-sm font-bold">MEMBER ID</p>,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('date', {
      header: () => <p className="text-sm font-bold">MEMBER CREATED</p>,
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor('date', {
    //   header: () => <p className="text-sm font-bold">MEMBER UPDATED</p>,
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.display({
          id: 'edit',
          header: () => <p className="text-sm font-bold">EDIT</p>,
          cell: ({ row }) => (
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                router.push(`/admin/Member/edit/${row.original.memberId}`)
              }
            >
              Edit
            </Button>
          ),
        }),
    columnHelper.accessor('status', {
      header: () => <p className="text-sm font-bold">STATUS</p>,
      cell: (info) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            info.getValue() === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'action',
      header: () => <p className="text-sm font-bold">ACTION</p>,
      cell: ({ row }) => (
        <Button
          size="small"
          variant="outlined"
          disabled={loadingRow === row.original.memberId}
          color={row.original.status === 'Active' ? 'error' : 'success'}
          onClick={() => toggleStatus(row.original)}
        >
          {loadingRow === row.original.memberId
            ? 'Updating...'
            : row.original.status === 'Active'
            ? 'Deactivate'
            : 'Activate'}
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card extra="w-full p-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-bold">All Members</h3>
        {/* <CardMenu /> */}
      </header>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="border-b py-2 text-left text-xs">
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

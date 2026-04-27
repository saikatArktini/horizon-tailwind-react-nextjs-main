'use client';

import BranchesTable from 'components/branches/BranchesTable';
import { useEffect, useState } from 'react';
//import BranchesTable from 'components/branches/BranchesTable';

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

export default function ViewAllBranchesPage() {
  const [data, setData] = useState<RowObj[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loadBranches = async () => {
      try {
        const res = await fetch('/api/branches', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const branches = await res.json();

        const mapped: RowObj[] = branches.map((b: any) => ({
          branchId: b.id.toString(),
          name: [b.branchName, true],   // checkbox enabled
          code: b.branchCode,
          city: b.city,
          level: b.branchLevel?.name || '-',
          country: b.country?.name || '-',
          state: b.state?.name || '-',
          date: new Date(b.createdAt).toDateString(),
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  if (loading) {
    return <p className="p-4">Loading branches...</p>;
  }

  return (
    <div className="space-y-6">
      <BranchesTable tableData={data} />
    </div>
  );
}

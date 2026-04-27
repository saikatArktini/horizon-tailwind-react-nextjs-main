'use client';

import { useEffect, useState } from 'react';
import MembersTable from 'components/agents/MembersTable';

type RowObj = {
  memberId: string;
  name: [string, boolean];
  branch: string;
  role: string;
  status: string;
  date: string;
};

export default function ViewAllMembersPage() {
  const [data, setData] = useState<RowObj[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loadMembers = async () => {
      try {
        const res = await fetch('/api/members', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const members = await res.json();

        const mapped: RowObj[] = members.map((m: any) => ({
          memberId: m.memberCode,                 // internal ID
          name: [m.fullName, true],               // checkbox enabled
          branch: m.branch?.branchName || '-',
          role: m.memberRole?.name || '-',
          status: m.status?.name || 'Inactive',
          date: new Date(m.createdAt).toDateString(),
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  if (loading) {
    return <p className="p-4">Loading members...</p>;
  }

  return (
    <div className="space-y-6">
      <MembersTable tableData={data} />
    </div>
  );
}

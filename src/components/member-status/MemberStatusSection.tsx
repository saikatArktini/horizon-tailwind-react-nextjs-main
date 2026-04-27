'use client';

import { useEffect, useState } from 'react';
import MemberStatusForm from './MemberStatusForm';
import MemberStatusTable from './MemberStatusTable';

export default function MemberStatusSection() {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<any | null>(null);

  const loadStatuses = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/member-statuses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setStatuses(data);
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  return (
    <div className="p-6">
      <MemberStatusForm
        selectedStatus={selectedStatus}
        onSuccess={() => {
          setSelectedStatus(null);
          loadStatuses();
        }}
      />

      <MemberStatusTable
        statuses={statuses}
        onEdit={(status) => setSelectedStatus(status)}
      />
    </div>
  );
}

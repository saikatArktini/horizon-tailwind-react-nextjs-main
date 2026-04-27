'use client';

import { useEffect, useState } from 'react';

type Props = {
  selectedStatus: any | null;
  onSuccess: () => void;
};

export default function MemberStatusForm({
  selectedStatus,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');

  /* Prefill on edit */
  useEffect(() => {
    if (selectedStatus) {
      setName(selectedStatus.name);
    } else {
      setName('');
    }
  }, [selectedStatus]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!name.trim()) {
      alert('Member status name is required');
      return;
    }

    const url = selectedStatus
      ? `/api/member-statuses/${selectedStatus.id}`
      : '/api/member-statuses';

    const method = selectedStatus ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setName('');
      onSuccess();
    } else {
      const errorRes = await res.json();
      //console.log("48",errorRes);
      alert(`Something went wrong: ${errorRes.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="border p-4 rounded mb-6">
      <h2 className="font-semibold mb-4">
        {selectedStatus ? 'Edit Member Status' : 'Create Member Status'}
      </h2>

      <div className="flex gap-4 items-center">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Member status name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {selectedStatus ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}

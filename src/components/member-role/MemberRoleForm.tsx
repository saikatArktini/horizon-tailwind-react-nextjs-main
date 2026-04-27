'use client';

import { useEffect, useState } from 'react';

type Props = {
  selectedRole: any | null;
  onSuccess: () => void;
};

export default function MemberRoleForm({
  selectedRole,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');

  /* Prefill on edit */
  useEffect(() => {
    if (selectedRole) {
      setName(selectedRole.name);
    } else {
      setName('');
    }
  }, [selectedRole]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!name.trim()) {
      alert('Role name is required');
      return;
    }

    const url = selectedRole
      ? `/api/member-roles/${selectedRole.id}`
      : '/api/member-roles';

    const method = selectedRole ? 'PATCH' : 'POST';

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
        {selectedRole ? 'Edit Member Role' : 'Create Member Role'}
      </h2>

      <div className="flex gap-4 items-center">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Role name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {selectedRole ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}

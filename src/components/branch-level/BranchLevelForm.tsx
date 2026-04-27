'use client';

import { useEffect, useState } from 'react';

type Props = {
  selectedLevel: any | null;
  onSuccess: () => void;
};

export default function BranchLevelForm({
  selectedLevel,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');

  /* Prefill on edit */
  useEffect(() => {
    if (selectedLevel) {
      setName(selectedLevel.name);
    } else {
      setName('');
    }
  }, [selectedLevel]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!name.trim()) {
      alert('Branch level name is required');
      return;
    }

    const url = selectedLevel
      ? `/api/branch-levels/${selectedLevel.id}`
      : '/api/branch-levels';

    const method = selectedLevel ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setName('');
      onSuccess();
    } else {
      alert('Something went wrong');
    }
  };

  return (
    <div className="border p-4 rounded mb-6">
      <h2 className="font-semibold mb-4">
        {selectedLevel ? 'Edit Branch Level' : 'Create Branch Level'}
      </h2>

      <div className="flex gap-4 items-center">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Branch level name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {selectedLevel ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}

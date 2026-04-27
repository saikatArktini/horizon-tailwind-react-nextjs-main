'use client';

import { useEffect, useState } from 'react';

type Props = {
  selectedGender: any | null;
  onSuccess: () => void;
};

export default function GenderForm({
  selectedGender,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');

  /* Prefill on edit */
  useEffect(() => {
    if (selectedGender) {
      setName(selectedGender.name);
    } else {
      setName('');
    }
  }, [selectedGender]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!name.trim()) {
      alert('Gender name is required');
      return;
    }

    const url = selectedGender
      ? `/api/genders/${selectedGender.id}`
      : '/api/genders';

    const method = selectedGender ? 'PATCH' : 'POST';

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
        {selectedGender ? 'Edit Gender' : 'Create Gender'}
      </h2>

      <div className="flex gap-4 items-center">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Gender name (e.g. Male, Female)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {selectedGender ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}

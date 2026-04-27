'use client';

import { useEffect, useState } from 'react';

type Props = {
  selectedState: any | null;
  countries: any[];
  selectedCountryId: number | null;
  onCountryChange: (id: number) => void;
  onSuccess: () => void;
};

export default function StateForm({
  selectedState,
  countries,
  selectedCountryId,
  onCountryChange,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');

  // 🔁 Prefill on edit
  useEffect(() => {
    if (selectedState) {
      setName(selectedState.name);
    } else {
      setName('');
    }
  }, [selectedState]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!name || !selectedCountryId) {
      alert('Country and state name are required');
      return;
    }

    const url = selectedState
      ? `/api/states/${selectedState.id}`
      : '/api/states';

    const method = selectedState ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name,
        countryId: selectedCountryId,
      }),
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
        {selectedState ? 'Edit State' : 'Create State'}
      </h2>

      <div className="flex gap-4 items-center">
        {/* COUNTRY */}
        <select
          className="border px-3 py-2 rounded"
          value={selectedCountryId ?? ''}
          onChange={(e) => onCountryChange(Number(e.target.value))}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* STATE NAME */}
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="State name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {selectedState ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

type Props = {
  selectedCountry?: any;
  onSuccess: () => void;
};

export default function CountryForm({ selectedCountry, onSuccess }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (selectedCountry) {
      setName(selectedCountry.name);
    } else {
      setName('');
    }
  }, [selectedCountry]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      selectedCountry
        ? `/api/countries/${selectedCountry.id}`
        : '/api/countries',
      {
        method: selectedCountry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      }
    );

    if (res.ok) {
      setName('');
      onSuccess();
    } else {
      alert('Something went wrong');
    }
  };

  return (
    <div className="border p-4 rounded mb-6">
      <h2 className="font-semibold mb-2">
        {selectedCountry ? 'Edit Country' : 'Create Country'}
      </h2>

      <div className="flex gap-2">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Country name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {selectedCountry ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}

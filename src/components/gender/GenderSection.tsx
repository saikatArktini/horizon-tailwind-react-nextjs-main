'use client';

import { useEffect, useState } from 'react';
import GenderForm from './GenderForm';
import GenderTable from './GenderTable';

export default function GenderSection() {
  const [genders, setGenders] = useState<any[]>([]);
  const [selectedGender, setSelectedGender] = useState<any | null>(null);

  const loadGenders = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/genders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setGenders(data);
  };

  useEffect(() => {
    loadGenders();
  }, []);

  return (
    <div className="p-6">
      <GenderForm
        selectedGender={selectedGender}
        onSuccess={() => {
          setSelectedGender(null);
          loadGenders();
        }}
      />

      <GenderTable
        genders={genders}
        onEdit={(gender) => setSelectedGender(gender)}
      />
    </div>
  );
}

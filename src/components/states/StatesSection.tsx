'use client';

import { useEffect, useState } from 'react';
import StateForm from './StateForm';
import StateTable from './StateTable';

export default function StatesSection() {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<any>(null);

  // 🔹 Load countries only
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch('/api/countries', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  // 🔹 Load states ONLY after country select
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!selectedCountryId) {
      setStates([]);
      return;
    }

    fetch(`/api/countries/${selectedCountryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setStates);
  }, [selectedCountryId]);
  const token = localStorage.getItem("token");
  return (
    <div className="p-6">
      <StateForm
        selectedState={selectedState}
        countries={countries}
        selectedCountryId={selectedCountryId}
        onCountryChange={(id) => {
          setSelectedCountryId(id);
          setSelectedState(null);
        }}
        onSuccess={() => {
          setSelectedState(null);
          fetch(`/api/countries/${selectedCountryId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then(setStates);
        }}
      />

      {/* 🚫 Table appears ONLY after country selection */}
      {selectedCountryId && (
        <StateTable
          states={states}
          onEdit={(state) => setSelectedState(state)}
        />
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import CountryForm from './CountryForm';
import CountryTable from './CountryTable';

export default function CountriesSection() {
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  const loadCountries = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/countries', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setCountries(data);
  };

  useEffect(() => {
    loadCountries();
  }, []);

  return (
    <div className="p-6">
      {/* CREATE / EDIT SECTION */}
      <CountryForm
        selectedCountry={selectedCountry}
        onSuccess={() => {
          setSelectedCountry(null);
          loadCountries();
        }}
      />

      {/* LIST SECTION */}
      <CountryTable
        countries={countries}
        onEdit={(country) => setSelectedCountry(country)}
      />
    </div>
  );
}

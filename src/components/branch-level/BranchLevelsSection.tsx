'use client';

import { useEffect, useState } from 'react';
import BranchLevelForm from './BranchLevelForm';
import BranchLevelTable from './BranchLevelTable';

export default function BranchLevelsSection() {
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any | null>(null);

  const loadLevels = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/branch-levels', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setLevels(data);
  };

  useEffect(() => {
    loadLevels();
  }, []);

  return (
    <div className="p-6">
      <BranchLevelForm
        selectedLevel={selectedLevel}
        onSuccess={() => {
          setSelectedLevel(null);
          loadLevels();
        }}
      />

      <BranchLevelTable
        levels={levels}
        onEdit={(level) => setSelectedLevel(level)}
      />
    </div>
  );
}

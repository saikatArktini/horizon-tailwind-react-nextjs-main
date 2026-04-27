'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BranchForm from 'components/branches/BranchForm';

export default function EditBranchPage() {
  const { id } = useParams();
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranch = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/branches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBranch(data);
      setLoading(false);
    };

    loadBranch();
  }, [id]);

  if (loading) return <p className="p-4">Loading branch...</p>;

  return <BranchForm initialData={branch} mode="edit" />;
}

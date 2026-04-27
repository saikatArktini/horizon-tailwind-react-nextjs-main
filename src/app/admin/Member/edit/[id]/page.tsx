'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MemberForm from 'components/agents/AgentForm';

export default function EditMemberPage() {
  const { id } = useParams();

  const [member, setMember] = useState<any>(null);
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Load Member
  useEffect(() => {
    const loadMember = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMember(data);
    };

    loadMember();
  }, [id]);

  // 2️⃣ Load Branch AFTER member exists
  useEffect(() => {
    if (!member?.branchId) return;
    const token = localStorage.getItem("token");
    const loadBranch = async () => {
      const res = await fetch(`/api/branches/${member.branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBranch(data);
      setLoading(false);
    };

    loadBranch();
  }, [member]);

  // 3️⃣ Loading guard (CRITICAL)
  if (loading || !member || !branch) {
    return <p className="p-4">Loading Member...</p>;
  }
  
  return (
    <MemberForm
      branch={branch}
      mode="edit"
      initialData={member}
    />
  );
}

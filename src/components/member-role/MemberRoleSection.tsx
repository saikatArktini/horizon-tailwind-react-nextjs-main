'use client';

import { useEffect, useState } from 'react';
import MemberRoleForm from './MemberRoleForm';
import MemberRoleTable from './MemberRoleTable';

export default function MemberRoleSection() {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  const loadRoles = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/member-roles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <div className="p-6">
      <MemberRoleForm
        selectedRole={selectedRole}
        onSuccess={() => {
          setSelectedRole(null);
          loadRoles();
        }}
      />

      <MemberRoleTable
        roles={roles}
        onEdit={(role) => setSelectedRole(role)}
      />
    </div>
  );
}

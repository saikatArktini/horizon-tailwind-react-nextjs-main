'use client';

type Props = {
  roles: any[];
  onEdit: (role: any) => void;
};

export default function MemberRoleTable({
  roles,
  onEdit,
}: Props) {
  if (!roles || roles.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        No member roles found.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Member Roles List</h3>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Role Name</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="border px-3 py-2">{role.id}</td>
              <td className="border px-3 py-2">{role.name}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => onEdit(role)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

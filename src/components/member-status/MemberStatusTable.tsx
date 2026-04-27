'use client';

type Props = {
  statuses: any[];
  onEdit: (status: any) => void;
};

export default function MemberStatusTable({
  statuses,
  onEdit,
}: Props) {
  if (!statuses || statuses.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        No member statuses found.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Member Status List</h3>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Status Name</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {statuses.map((status) => (
            <tr key={status.id}>
              <td className="border px-3 py-2">{status.id}</td>
              <td className="border px-3 py-2">{status.name}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => onEdit(status)}
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

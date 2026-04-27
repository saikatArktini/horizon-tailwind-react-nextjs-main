'use client';

type Props = {
  levels: any[];
  onEdit: (level: any) => void;
};

export default function BranchLevelTable({ levels, onEdit }: Props) {
  if (!levels || levels.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        No branch levels found.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Branch Levels</h3>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Level Name</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {levels.map((level) => (
            <tr key={level.id}>
              <td className="border px-3 py-2">{level.id}</td>
              <td className="border px-3 py-2">{level.name}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => onEdit(level)}
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

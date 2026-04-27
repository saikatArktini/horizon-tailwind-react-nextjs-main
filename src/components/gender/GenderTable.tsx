'use client';

type Props = {
  genders: any[];
  onEdit: (gender: any) => void;
};

export default function GenderTable({
  genders,
  onEdit,
}: Props) {
  if (!genders || genders.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        No genders found.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Gender List</h3>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Gender Name</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {genders.map((gender) => (
            <tr key={gender.id}>
              <td className="border px-3 py-2">{gender.id}</td>
              <td className="border px-3 py-2">{gender.name}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => onEdit(gender)}
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

'use client';

type Props = {
  states: any[];
  onEdit: (state: any) => void;
};

export default function StateTable({ states, onEdit }: Props) {
  if (!states || states.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        No states found for the selected country.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">States List</h3>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">State Name</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {states.length > 0 && states.map((state) => (
            <tr key={state.id}>
              <td className="border px-3 py-2">{state.id}</td>
              <td className="border px-3 py-2">{state.name}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => onEdit(state)}
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

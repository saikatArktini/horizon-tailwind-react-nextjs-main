'use client';

type Props = {
  countries: any[];
  onEdit: (country: any) => void;
};

export default function CountryTable({ countries, onEdit }: Props) {
  return (
    <table className="w-full border border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-3 py-2 text-left">ID</th>
          <th className="border px-3 py-2 text-left">Country Name</th>
          <th className="border px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <tr key={country.id}>
            <td className="border px-3 py-2">{country.id}</td>
            <td className="border px-3 py-2">{country.name}</td>
            <td className="border px-3 py-2">
              <button
                onClick={() => onEdit(country)}
                className="text-blue-600 underline"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

'use client';

type MemberSummaryCardProps = {
  member: {
    memberCode: string;
    name: string;
    branch?: {
      name: string;
    };
    status?: {
      name: string;
    };
    phone?: string;
    email?: string;
  };
};

export default function MemberSummaryCard({member}) {
  console.log("19",member);
  return (
    <div className="rounded-lg border bg-gray-50 p-4 mt-4">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        Member Details
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Member Code</p>
          <p className="font-medium">{member.memberCode}</p>
        </div>

        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium">{member.fullName}</p>
        </div>

        <div>
          <p className="text-gray-500">Branch</p>
          <p className="font-medium">
            {member.branch?member.branch : "—"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              member.status === 'Active'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {member.status? member.status: "Unknown"}
          </span>
        </div>

        {member.phone && (
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{member.phone}</p>
          </div>
        )}

        {member.email && (
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{member.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

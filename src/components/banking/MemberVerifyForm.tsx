'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import MemberSummaryCard from "./MemberSummaryCard";

export default function MemberVerifyForm({ accountType }: { accountType: string }) {
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔍 Fetch member summary
  const fetchSummary = async () => {
    setLoading(true);
    setMember(null);

    const res = await fetch("/api/banking/member-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      return alert(err.message || "Member not found");
    }

    const data = await res.json();
    setMember(data.member);
  };

  // 🔐 Verify + redirect
  const verify = async () => {
    const res = await fetch("/api/banking/verify-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberId: memberId,
        accountType,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.message || "Verification failed");
    }

    const data = await res.json();

    router.push(
      `/admin/Banking/${accountType}/create?token=${data.token}`
    );
  };

  return (
    <div className="space-y-4 max-w-md">
      <input
        className="border px-3 py-2 w-full"
        placeholder="Enter Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
      />

      <button
        onClick={fetchSummary}
        className="bg-gray-700 text-white px-4 py-2 rounded w-full"
        disabled={!memberId || loading}
      >
        {loading ? "Checking..." : "Check Member"}
      </button>

      {member && (
        <>
          <MemberSummaryCard member={member} />

          <button
            onClick={verify}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Verify Member
          </button>
        </>
      )}
    </div>
  );
}

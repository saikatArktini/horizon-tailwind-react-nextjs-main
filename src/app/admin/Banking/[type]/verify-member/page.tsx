'use client';

import MemberVerifyForm from "components/banking/MemberVerifyForm";
//import MemberVerifyForm from "components/banking/MemberVerifyForm";
import { useParams } from "next/navigation";

export default function VerifyMemberPage() {
  const { type } = useParams();
  console.log("",type);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold capitalize">
        Verify Member – {type}
      </h1>

      <MemberVerifyForm accountType={type as string} />
    </div>
  );
}

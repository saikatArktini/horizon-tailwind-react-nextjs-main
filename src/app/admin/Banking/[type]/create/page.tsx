import AccountCreateForm from "components/banking/AccountCreateForm";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function CreateAccountPage({
  params,
  searchParams,
}: PageProps) {
  // ✅ MUST await in Next 14+
  const { type } = await params;
  const { token } = await searchParams;

  if (!token) {
    redirect(`/admin/Banking/${type}/verify-member`);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect(`/admin/Banking/${type}/verify-member`);
  }
  console.log("27", type);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold capitalize">
        Create {type.replace("-", " ")} Account
      </h1>
      <AccountCreateForm token={token} accountType={type} />
    </div>
  );
}

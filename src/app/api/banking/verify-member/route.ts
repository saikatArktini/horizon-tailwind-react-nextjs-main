import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { signVerificationToken } from "app/api/_lib/auth";

export async function POST(req: Request) {
  const { memberId, accountType } = await req.json();

  if (!memberId || !accountType) {
    return NextResponse.json(
      { message: "memberId and accountType are required" },
      { status: 400 }
    );
  }

  // 1️⃣ Fetch member
  const member = await prisma.member.findUnique({
    where: { memberCode: memberId },
    include: {
      branch: true,
      status: true,
      memberRole: true,
    },
  });
  if (!member|| member.statusId !== 1) {
    return NextResponse.json(
      { message: "Member not found or not active" },
      { status: 404 }
    );
  }

  // 2️⃣ Resolve accountType → accountTypeId
  const accountTypeRow = await prisma.accountType.findUnique({
    where: { code: accountType }, // e.g. "savings-account"
  });
  console.log("35",accountTypeRow);
  if (!accountTypeRow) {
    return NextResponse.json(
      { message: "Invalid account type" },
      { status: 400 }
    );
  }

  // 3️⃣ Create verification token
  const token = signVerificationToken({
    memberId: member.id,
    branchId: member.branchId,
    accountTypeId: accountTypeRow.id,
  });

  // 4️⃣ Persist verification record
  await prisma.accountVerification.create({
    data: {
      token,
      memberId: member.id,
      branchId: member.branchId,
      accountTypeId: accountTypeRow.id,
      verifiedByUserId: member.createdByUserId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    },
  });

  // 5️⃣ Response expected by frontend
  return NextResponse.json({
    success: true,
    token,
    member: {
      id: member.id,
      memberCode: member.memberCode,
      fullName: member.fullName,
      mobile: member.mobile,
      branch: member.branch.branchName,
      status: member.status.name,
    },
  });
}

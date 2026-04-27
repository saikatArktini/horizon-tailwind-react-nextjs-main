import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { memberId } = await req.json();

  if (!memberId) {
    return NextResponse.json(
      { message: "memberId is required" },
      { status: 400 }
    );
  }

  const member = await prisma.member.findUnique({
    where: { memberCode: memberId },
    include: {
      branch: true,
      status: true,
      memberRole: true,
    },
  });

  if (!member) {
    return NextResponse.json(
      { message: "Member not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    member: {
      id: member.id,
      memberCode: member.memberCode,
      fullName: member.fullName,
      mobile: member.mobile,
      branch: member.branch.branchName,
      status: member.status.name,
      role: member.memberRole.name,
    },
  });
}

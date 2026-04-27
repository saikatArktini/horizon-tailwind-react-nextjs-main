//import { prisma } from "@/app/api/_lib/prisma";
//import { verifyToken } from "@/app/api/_lib/auth";
import { verifyToken } from "app/api/_lib/auth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";

/* ======================
   Account Number Generator
   ====================== */
const gen = (prefix: string, branchId: number) =>
  `${prefix}-${branchId}-${Date.now().toString().slice(-6)}`;

/* ======================
   API
   ====================== */
export async function POST(req: Request) {
  const {
    token,
    accountType,
    amount,
    tenure,
    interestRate,
    monthlyInstallment,
    loanPurpose,
    compoundingFrequency,
    maturityAmount,
    maturityDate,
    interestEarned,
    nomineeName,
    nomineeRelation,
    monthlyAmount,
    emiAmount,
    outstandingAmount, 
    totalInterest,
    monthlyPayout
  } = await req.json();

  /* 1️⃣ Verify JWT token */
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const { memberId, branchId } = payload;

  /* 2️⃣ Verify token record exists */
  const verification = await prisma.accountVerification.findUnique({
    where: { token },
  });

  if (!verification) {
    return NextResponse.json(
      { message: "Verification not found or already used" },
      { status: 403 }
    );
  }

  /* 3️⃣ Get ACTIVE status dynamically */
  const activeStatus = await prisma.accountStatus.findUnique({
    where: { name: "ACTIVE" },
  });

  if (!activeStatus) {
    return NextResponse.json(
      { message: "ACTIVE account status not configured" },
      { status: 500 }
    );
  }

  const statusId = activeStatus.id;

  /* ======================
     4️⃣ Account Creation
     ====================== */
  switch (accountType) {
    /* 🟢 SAVINGS */
    case "savings-account":
      await prisma.savingsAccount.create({
        data: {
          accountNumber: gen("SAV", branchId),
          memberId,
          branchId,
          statusId,
          balance: Number(amount || 0),
          nomineeName,
          nomineeRelation,
        },
      });
      break;

    /* 🔵 CURRENT */
    case "current-account":
      await prisma.currentAccount.create({
        data: {
          accountNumber: gen("CUR", branchId),
          memberId,
          branchId,
          statusId,
          balance: Number(amount || 0),
        },
      });
      break;

    /* 🟣 FIXED DEPOSIT */
    case "fixed-deposit":
      await prisma.fixedDepositAccount.create({
        data: {
          fdNumber: gen("FD", branchId),
          memberId,
          branchId,
          statusId,
          principalAmount: Number(amount),
          tenureMonths: Number(tenure),
          interestRate: Number(interestRate),
          compoundingFreq: compoundingFrequency,
          maturityAmount: Number(maturityAmount),
          interestEarned: Number(interestEarned),
          maturityDate: new Date(maturityDate),
          nomineeName,
          nomineeRelation,
        },
      });
      break;

    /* 🟠 RECURRING DEPOSIT */
    case "recurring-deposit":
      await prisma.recurringDepositAccount.create({
        data: {
          rdNumber: gen("RD", branchId),
          memberId,
          branchId,
          statusId,
          monthlyAmount: Number(monthlyAmount),
          tenureMonths: Number(tenure),
          interestRate: Number(interestRate),
          maturityAmount: Number(maturityAmount),
          interestEarned: Number(interestEarned),
          maturityDate: new Date(maturityDate),
          nomineeName,
          nomineeRelation,
        },
      });
      break;

    /* 🔴 LOAN */
    case "loan":
      await prisma.loanAccount.create({
        data: {
          loanNumber: gen("LN", branchId),
          memberId,
          branchId,
          statusId,
          loanAmount: Number(amount),
          tenureMonths: Number(tenure),
          interestRate: Number(interestRate),
          emiAmount: Number(emiAmount),
          outstandingAmount: Number(outstandingAmount),
          totalInterest: Number(totalInterest),
          maturityDate: new Date(maturityDate),
          purpose:loanPurpose,
        },
      });
      break;

    /* 🟡 MIS */
    case "mis":
      await prisma.MISAccount.create({
        data: {
          misNumber: gen("MIS", branchId),
          memberId,
          branchId,
          statusId,
          investmentAmount: Number(amount),
          tenureMonths: Number(tenure),
          interestRate: Number(interestRate),
          monthlyPayout: Number(monthlyPayout),
          maturityDate: new Date(maturityDate),
          maturityAmount: Number(maturityAmount),
          totalInterest: Number(totalInterest),
          nomineeName,
          nomineeRelation,
        },
      });
      break;

    default:
      return NextResponse.json(
        { message: "Invalid account type" },
        { status: 400 }
      );
  }

  /* 5️⃣ Delete token (single use) */
  await prisma.accountVerification.delete({
    where: { token },
  });

  return NextResponse.json({
    success: true,
    message: "Account created successfully",
  });
}

'use client';

import { useState } from 'react';

type Props = {
  token: string;
  accountType:string
    | 'savings'
    | 'current'
    | 'fixed-deposit'
    | 'recurring'
    | 'loan'
    | 'mis';
};

export default function AccountCreateForm({ token, accountType }: Props) {
  const [form, setForm] = useState<any>({
    amount: '',
    tenure: '',
    interestRate: '',
    monthlyInstallment: '',
    loanPurpose: '',
    nomineeName: '',
    nomineeRelation: '',
    compoundingFrequency: '',
    maturityDate: '',
    maturityAmount: '',
  interestEarned: '',
  });
//   const calculateMaturityDate = (
//   tenureMonths: number,
//   frequency: string
// ) => {
//   if (!tenureMonths || !frequency) return '';

//   cojgdst start = new Date();
//   const maturity = new Date(start);

//   maturity.setMonth(start.getMonth() + tenureMonths);

//   return maturity.toISOString().split('T')[0]; // YYYY-MM-DD
// };
const frequencyMap: Record<string, number> = {
  monthly: 12,
  quarterly: 4,
  'half-yearly': 2,
  yearly: 1,
};
const calculateLoan = (
  loanAmount: number,
  tenureMonths: number,
  interestRate: number
) => {
  if (!loanAmount || !tenureMonths || !interestRate) {
    return { emi: '', totalInterest: '', totalPayable: '' };
  }

  const P = loanAmount;
  const R = interestRate / 100 / 12; // monthly interest rate
  const N = tenureMonths;

  const emi =
    (P * R * Math.pow(1 + R, N)) /
    (Math.pow(1 + R, N) - 1);

  const totalPayable = emi * N;
  const totalInterest = totalPayable - P;

  return {
    emi: emi.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    totalPayable: totalPayable.toFixed(2),
  };
};
const calculateMis = (
  principalAmount: number,
  tenureMonths: number,
  interestRate: number
) => {
  if (!principalAmount || !tenureMonths || !interestRate) {
    return {
      monthlyInterest: '',
      totalInterest: '',
      maturityAmount: '',
    };
  }

  const P = principalAmount;
  const R = interestRate / 100; // annual rate in decimal
  const months = tenureMonths;

  const monthlyInterest = (P * R) / 12;
  const totalInterest = monthlyInterest * months;
  const maturityAmount = P; // principal returned at maturity

  return {
    monthlyInterest: monthlyInterest.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    maturityAmount: maturityAmount.toFixed(2),
  };
};

const calculateFD = (
  amount: number,
  tenureMonths: number,
  interestRate: number,
  frequency: string
) => {
  if (!amount || !tenureMonths || !interestRate || !frequency) {
    return { maturityAmount: '', interestEarned: '' };
  }

  const P = amount;
  const R = interestRate / 100;
  const F = frequencyMap[frequency];
  const N = tenureMonths / 12;

  const A = P * Math.pow(1 + R / F, F * N);
  const interest = A - P;

  return {
    maturityAmount: A.toFixed(2),
    interestEarned: interest.toFixed(2),
  };
};
const calculateRD = (
  monthlyInstallment: number,
  tenureMonths: number,
  interestRate: number
) => {
  if (!monthlyInstallment || !tenureMonths || !interestRate) {
    return { maturityAmount: '', interestEarned: '' };
  }

  const R = monthlyInstallment;
  const i = interestRate / 400;        // quarterly rate
  const n = tenureMonths / 3;          // number of quarters

  const maturity =
    R *
    ((Math.pow(1 + i, n) - 1) /
      (1 - Math.pow(1 + i, -1 / 3)));

  const totalInvestment = R * tenureMonths;
  const interestEarned = maturity - totalInvestment;

  return {
    maturityAmount: maturity.toFixed(2),
    interestEarned: interestEarned.toFixed(2),
  };
};

// const calculateMaturityDate = (tenureMonths: number) => {
//   const d = new Date();
//   d.setMonth(d.getMonth() + tenureMonths);
//   return d.toISOString().split('T')[0];
// };
function convertToTenureMonths(
  years: number,
  months: number,
  days: number
) {
  return years * 12 + months + Math.floor(days / 30);
}
function convertToQuarters(years: number, months: number, days: number) {
  return years * 4 + Math.floor(months / 3) + Math.floor(days / 90);
}
function calculateMaturityDate(
  years: number,
  months: number,
  days: number
) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  date.setMonth(date.getMonth() + months);
  date.setDate(date.getDate() + days);
  return date;
}


const handleChange = (key: string, value: string) => {
    
  setForm((prev: any) => {
    const updated = {
      ...prev,
      [key]: value,
    };

    const years = Number(updated.tenureYears || 0);
    const months = Number(updated.tenureMonths || 0);
    const days = Number(updated.tenureDays || 0);

    // 🚫 Prevent zero tenure calculation
    if (years === 0 && months === 0 && days === 0) {
      updated.maturityAmount = '';
      updated.interestEarned = '';
      updated.maturityDate = '';
      updated.emiAmount='';
      updated.outstandingAmount=''; 
      updated.totalInterest='';
      return updated;
    }

    // Convert Y/M/D → total months
    const tenureMonths = convertToTenureMonths(years, months, days);
    updated.tenure = tenureMonths;
    // if(accountType === 'recurring-deposit'){
    //     const tenureQuarters = convertToQuarters(years, months, days);
    //     updated.tenure = tenureQuarters;
    // }
    if(accountType === 'recurring-deposit'&&updated.monthlyAmount&&updated.interestRate){
        const result = calculateRD(
            Number(updated.monthlyAmount),
            tenureMonths,
            Number(updated.interestRate)
        );
        updated.maturityAmount = result.maturityAmount;
        updated.interestEarned = result.interestEarned;
        updated.maturityDate = calculateMaturityDate(
            years,
            months,
            days
        )
    }
    if(accountType==='loan'&&updated.amount&&updated.interestRate){
        // updated.maturityDate = calculateMaturityDate(
        //     years,
        //     months,
        //     days
        // )
        const result = calculateLoan(
            Number(updated.amount),
            tenureMonths,
            Number(updated.interestRate)
        );
        // updated.maturityAmount = result.maturityAmount;
        // updated.interestEarned = result.interestEarned;
        updated.emiAmount=result.emi;
        updated.outstandingAmount=result.totalPayable;
        updated.totalInterest=result.totalInterest;
        console.log("211",result);
        updated.maturityDate = calculateMaturityDate(
            years,
            months,
            days
        )
    }
    // FD calculations only
    if (
      accountType === 'fixed-deposit' &&
      updated.amount &&
      updated.interestRate &&
      updated.compoundingFrequency
    ) {
      const result = calculateFD(
        Number(updated.amount),
        tenureMonths,
        Number(updated.interestRate),
        updated.compoundingFrequency
      );

      updated.maturityAmount = result.maturityAmount;
      updated.interestEarned = result.interestEarned;
      updated.maturityDate = calculateMaturityDate(
        years,
        months,
        days
      );
    }
    if(accountType==='mis'&&updated.amount&&updated.interestRate){
        const result = calculateMis(
            Number(updated.amount),
            tenureMonths,
            Number(updated.interestRate)
        );
        updated.maturityAmount = result.maturityAmount;
        updated.totalInterest = result.totalInterest;
        updated.monthlyPayout = result.monthlyInterest;
        console.log("279",result);
        updated.maturityDate = calculateMaturityDate(
            years,
            months,
            days
        )
    }
    return updated;
  });
};


  const submit = async () => {
    console.log("198",form);
    const res = await fetch('/api/banking/create-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        token,
        accountType,
        ...form,
      }),
    });
    // if (res.ok) alert('Account Created Successfully');
    // else alert('Account Creation Failed');
    if(res.ok)
    {
      const data = await res.json();
      alert(data.message||'Account Created Successfully');
    }
    else
    {
      const err=await res.json();
      alert(err.message);
    }
  };

  /* ======================
     Dynamic Field Rules
     ====================== */

  const isSavings = accountType === 'savings-account';
  const isCurrent = accountType === 'current-account';
  const isFD = accountType === 'fixed-deposit';
  const isRD = accountType === 'recurring-deposit';
  const isLoan = accountType === 'loan';
  const isMIS = accountType === 'mis';

  return (
    <div className="max-w-xl space-y-4 border p-6 rounded">
      <h2 className="text-xl font-bold capitalize">
        Create {accountType.replace('-', ' ')} Account
      </h2>

      {/* Amount */}
      {!isRD && (
          <input
        className="border px-3 py-2 w-full"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
      />
      )}

      {/* Tenure (FD, RD, Loan, MIS) */}
      {(isFD || isRD || isLoan || isMIS) && (
        <div className="grid grid-cols-3 gap-2">
  {/* Years */}
  <select
    className="border px-3 py-2 w-full"
    value={form.tenureYears || 0}
    onChange={(e) => handleChange('tenureYears', e.target.value)}
  >
    {Array.from({ length: 11 }).map((_, i) => (
      <option key={i} value={i}>
        {i} Year{i !== 1 && 's'}
      </option>
    ))}
  </select>

  {/* Months */}
  <select
    className="border px-3 py-2 w-full"
    value={form.tenureMonths || 0}
    onChange={(e) => handleChange('tenureMonths', e.target.value)}
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <option key={i} value={i}>
        {i} Month{i !== 1 && 's'}
      </option>
    ))}
  </select>

  {/* Days */}
  <select
    className="border px-3 py-2 w-full"
    value={form.tenureDays || 0}
    onChange={(e) => handleChange('tenureDays', e.target.value)}
  >
    {Array.from({ length: 31 }).map((_, i) => (
      <option key={i} value={i}>
        {i} Day{i !== 1 && 's'}
      </option>
    ))}
  </select>
</div>

      )}

      {/* Interest Rate (FD, RD, Loan, MIS) */}
      {(isFD || isRD || isLoan || isMIS) && (
        <input
          className="border px-3 py-2 w-full"
          placeholder="Interest Rate (%)"
          value={form.interestRate}
          onChange={(e) => handleChange('interestRate', e.target.value)}
        />
      )}

      {/* Monthly Installment (RD, Loan) */}
      {(isRD) && (
        <input
          className="border px-3 py-2 w-full"
          placeholder="Monthly Installment"
          value={form.monthlyAmount}
          onChange={(e) =>
            handleChange('monthlyAmount', e.target.value)
          }
        />
      )}

      {/* Loan Purpose */}
      {isLoan && (
        <input
          className="border px-3 py-2 w-full"
          placeholder="Loan Purpose"
          value={form.loanPurpose}
          onChange={(e) => handleChange('loanPurpose', e.target.value)}
        />
      )}

      
      {isFD && (
  <select
    className="border px-3 py-2 w-full"
    value={form.compoundingFrequency}
    onChange={(e) =>
      handleChange('compoundingFrequency', e.target.value)
    }  
  >
    <option disabled value="">Select Compounding Frequency</option>
    <option value="monthly">Monthly</option>
    <option value="quarterly">Quarterly</option>
    <option value="half-yearly">Half-Yearly</option>
    <option value="yearly">Yearly</option>
  </select>
)}

{(isFD|| isRD|| isLoan|| isMIS) && form.maturityDate && (
  

<input
  className="border px-3 py-2 w-full bg-gray-100"
  placeholder={isLoan ? 'Loan End Date' : 'Maturity Date'}
  value={
    // form.maturityDate
    //   ? new Date(form.maturityDate).toLocaleDateString()
    //   : ''
    isLoan ? `Loan End Date: ${form.maturityDate?.toISOString().split('T')[0]}` : `Maturity Date: ${form.maturityDate?.toISOString().split('T')[0]}`
  }
  disabled
/>

)}
{(isFD || isRD|| isMIS) && form.maturityAmount &&  (
  <input
  className="border px-3 py-2 w-full bg-gray-100"
  placeholder="Maturity Amount"
  value={`Maturity Amount: ₹${form.maturityAmount}` || ''}
  disabled
/>
)}
{(isLoan) && form.emiAmount &&  (
  <input
  className="border px-3 py-2 w-full bg-gray-100"
  placeholder="EMI Amount"
  value={`EMI Amount: ₹${form.emiAmount}` || ''}
  disabled
/>
)}
{(isMIS) && form.monthlyPayout &&  (
  <input
  className="border px-3 py-2 w-full bg-gray-100"
  placeholder="Monthly Payout"
  value={`Monthly Payout: ₹${form.monthlyPayout}` || ''}
  disabled
/>
)}

{(isLoan) && form.outstandingAmount &&  (
  <input
  className="border px-3 py-2 w-full bg-gray-100"
  placeholder="Outstanding Amount"
  value={`Outstanding Amount: ₹${form.outstandingAmount}` || ''}
  disabled
/>
)}
{(isLoan|| isMIS) && form.totalInterest &&  (
  <input
  className="border px-3 py-2 w-full bg-gray-100"
  placeholder="Total Interest Payable"
  value={`Total Interest Payable: ₹${form.totalInterest}` || ''}
  disabled
/>
)}

{(isFD || isRD) && form.interestEarned && (
  <input
    className="border px-3 py-2 w-full bg-gray-100"
    value={`Interest Earned: ₹${form.interestEarned}`}
    disabled
  />
)}

{/* Nominee (Savings, FD, RD, MIS) */}
      {(isSavings || isFD || isRD || isMIS) && (
        <>
          <input
            className="border px-3 py-2 w-full"
            placeholder="Nominee Name"
            value={form.nomineeName}
            onChange={(e) => handleChange('nomineeName', e.target.value)}
          />

          <input
            className="border px-3 py-2 w-full"
            placeholder="Nominee Relation"
            value={form.nomineeRelation}
            onChange={(e) =>
              handleChange('nomineeRelation', e.target.value)
            }
          />
        </>
      )}

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Create Account
      </button>
    </div>
  );
}

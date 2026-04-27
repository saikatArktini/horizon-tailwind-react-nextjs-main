'use client';

import React, { useEffect, useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import FormSection from './FormSection';
import { useRouter } from 'next/navigation';
type Option = { id: number; name: string };

type MemberFormProps = {
  branch: {
    id: number;
    branchName: string;
    branchCode: string;
  };
  mode?: 'create' | 'edit';
  initialData?: any;
};

/* 🔹 Generate member code (CREATE only) */
const generateMemberCode = (branchCode: string) => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `MEM-${branchCode}-${year}-${random}`;
};

export default function MemberForm({
  branch,
  mode = 'create',
  initialData,
}: MemberFormProps) {
  const isEdit = mode === 'edit';
  const router = useRouter();
  /* 🔹 FORM STATE */
  const initialFormState = {
    // BASIC
    fullName: '',
    mobile: '',
    email: '',
    genderId: '',
    memberRoleId: '',
    statusId: '',
    referenceMemberId: '',

    // KYC
    aadhaarNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',

    // BANK
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    commissionPercentage: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [memberCode, setMemberCode] = useState('');

  /* 🔹 MASTER DATA */
  const [genders, setGenders] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);
  const [statuses, setStatuses] = useState<Option[]>([]);

  /* 🔹 Reference verification */
  const [referenceId, setReferenceId] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [isReferenceValid, setIsReferenceValid] = useState<boolean | null>(null);

  /* 🔹 Load dropdown masters */
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch('/api/genders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setGenders);
    fetch('/api/member-roles', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setRoles);
    fetch('/api/member-statuses', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setStatuses);
  }, []);

  /* 🔹 Generate / set member code */
  useEffect(() => {
    if (isEdit && initialData) {
      setMemberCode(initialData.memberCode);
    } else {
      setMemberCode(generateMemberCode(branch.branchCode));
    }
  }, [branch.branchCode, isEdit, initialData]);

  /* 🔹 Pre-populate ALL fields in EDIT */
  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        fullName: initialData.fullName ?? '',
        mobile: initialData.mobile ?? '',
        email: initialData.email ?? '',
        genderId: initialData.genderId ?? '',
        memberRoleId: initialData.memberRoleId ?? '',
        statusId: initialData.statusId ?? '',
        referenceMemberId: initialData.referenceMemberId ?? '',

        aadhaarNumber: initialData.aadhaarNumber ?? '',
        panNumber: initialData.panNumber ?? '',
        address: initialData.address ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        pincode: initialData.pincode ?? '',

        bankName: initialData.bankName ?? '',
        accountNumber: initialData.accountNumber ?? '',
        ifscCode: initialData.ifscCode ?? '',
        commissionPercentage: initialData.commissionPercentage ?? '',
      });
    }
  }, [isEdit, initialData]);

  /* 🔹 Reference verification */
  const handleReferenceChange = async (id: string) => {
    const token = localStorage.getItem("token");
    setReferenceId(id);

    if (!id) {
      setIsReferenceValid(null);
      setReferenceName('');
      return;
    }

    const res = await fetch(`/api/members/${id}/referrals`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setReferenceName(data[0].fullName);
      setForm(f => ({ ...f, referenceMemberId: data[0].memberCode }));
      setIsReferenceValid(true);
    } else {
      setReferenceName('');
      setIsReferenceValid(false);
    }
  };

  /* 🔹 Submit (CREATE + UPDATE) */
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const url = isEdit
      ? `/api/members/${initialData.id}`
      : '/api/members';

    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...form,
        memberCode,
        branchId: branch.id,
        createdByUserId: 1,
      }),
    });
    console.log(res);
    if (res.ok) {
      alert(isEdit ? 'Member updated successfully' : 'Member created successfully');
      if(isEdit){
        router.push('/admin/All-Members');
      }
    } else {
      const err = await res.json();
      alert(err.message || 'Something went wrong');
    }
  };
  console.log("168",form);
  return (
    <form className="space-y-6">

      {/* BRANCH INFO */}
      <FormSection title="Branch Information">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Branch Name" value={branch.branchName} disabled />
          <TextField label="Branch Code" value={branch.branchCode} disabled />
        </div>
      </FormSection>

      {/* REFERENCE */}
      {!isEdit && (
        <FormSection title="Reference Verification">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Reference ID"
              value={referenceId}
              onChange={e => handleReferenceChange(e.target.value)}
              error={isReferenceValid === false}
              helperText={
                isReferenceValid === false
                  ? 'Invalid Reference ID'
                  : isReferenceValid === true
                  ? 'Reference verified'
                  : ''
              }
            />
            <TextField label="Reference Name" value={referenceName} disabled />
          </div>
        </FormSection>
      )}

      {/* BASIC */}
      <FormSection title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Full Name"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
          />
          <TextField label="Member Code" value={memberCode} disabled />
          <TextField
            label="Mobile"
            value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value })}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            select
            label="Gender"
            value={form.genderId}
            onChange={e => setForm({ ...form, genderId: e.target.value })}
          >
            {genders.map(g => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </TextField>
        </div>
      </FormSection>

      {/* ASSIGNMENT */}
      <FormSection title="Assignment">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            select
            label="Role"
            value={form.memberRoleId}
            onChange={e => setForm({ ...form, memberRoleId: e.target.value })}
          >
            {roles.map(r => (
              <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            value={form.statusId}
            onChange={e => setForm({ ...form, statusId: e.target.value })}
          >
            {statuses.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>
        </div>
      </FormSection>

      {/* KYC */}
      <FormSection title="KYC Details">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Aadhaar Number" value={form.aadhaarNumber}
            onChange={e => setForm({ ...form, aadhaarNumber: e.target.value })} />
          <TextField label="PAN Number" value={form.panNumber}
            onChange={e => setForm({ ...form, panNumber: e.target.value })} />
          <TextField label="Address" multiline rows={2} value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })} />
          <TextField label="City" value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })} />
          <TextField label="State" value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })} />
          <TextField label="Pincode" value={form.pincode}
            onChange={e => setForm({ ...form, pincode: e.target.value })} />
        </div>
      </FormSection>

      {/* BANK */}
      <FormSection title="Bank & Commission Details">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Bank Name" value={form.bankName}
            onChange={e => setForm({ ...form, bankName: e.target.value })} />
          <TextField label="Account Number" value={form.accountNumber}
            onChange={e => setForm({ ...form, accountNumber: e.target.value })} />
          <TextField label="IFSC Code" value={form.ifscCode}
            onChange={e => setForm({ ...form, ifscCode: e.target.value })} />
          <TextField
            label="Commission (%)"
            type="number"
            value={form.commissionPercentage}
            onChange={e =>
              setForm({ ...form, commissionPercentage: e.target.value })
            }
          />
        </div>
      </FormSection>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4">
        <Button variant="outlined">Cancel</Button>
        <Button
          variant="contained"
          disabled={!isEdit && !isReferenceValid}
          onClick={handleSubmit}
        >
          {isEdit ? 'Update Member' : 'Register Member'}
        </Button>
      </div>
    </form>
  );
}

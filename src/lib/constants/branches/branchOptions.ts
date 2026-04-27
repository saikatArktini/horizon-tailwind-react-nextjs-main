export const countries = ["India"];

export const statesIndia = [
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "West Bengal",
];

export const geoFenceOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export const branchLevels = [
  "Head Office",
//   "Regional Office",
//   "Zonal Office",
  "Branch Office",
];

export const branches = [
  {
    id: "ho-001",
    name: "Head Office – Mumbai",
    code: "HO-MUM",
    level: "Head Office",
  },
  {
    id: "br-001",
    name: "Mumbai Branch",
    code: "BR-MUM-01",
    level: "Branch Office",
  },
  {
    id: "br-002",
    name: "Delhi Branch",
    code: "BR-DEL-01",
    level: "Branch Office",
  },
  {
    id: "br-003",
    name: "Bangalore Branch",
    code: "BR-BLR-01",
    level: "Branch Office",
  },
];
// lib/constants/members/membersData.ts

export type MemberRow = {
  memberId: string; // INTERNAL ID (used for verification)
  name: [string, boolean];
  branch: string;
  role: string;
  status: string;
  date: string;
};

export const membersTableData: MemberRow[] = [
  {
    memberId: 'MEM-1001',
    name: ['Ravi Kumar', true],
    branch: 'Mumbai HO',
    role: 'Member',
    status: 'Active',
    date: '12 Jan 2024',
  },
  {
    memberId: 'MEM-1002',
    name: ['Anita Sharma', false],
    branch: 'Delhi Branch',
    role: 'Member',
    status: 'Inactive',
    date: '22 Feb 2024',
  },
  {
    memberId: 'MEM-1003',
    name: ['Suresh Patil', true],
    branch: 'Pune Branch',
    role: 'Member',
    status: 'Active',
    date: '05 Mar 2024',
  },
  {
    memberId: 'MEM-1004',
    name: ['Neha Verma', true],
    branch: 'Kolkata Branch',
    role: 'Member',
    status: 'Active',
    date: '18 Mar 2024',
  },
  {
    memberId: 'MEM-1005',
    name: ['Amit Das', false],
    branch: 'Chennai Branch',
    role: 'Member',
    status: 'Inactive',
    date: '01 Apr 2024',
  },
];
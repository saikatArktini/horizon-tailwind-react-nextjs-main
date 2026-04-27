import {
  MdSavings,
  MdAccountBalance,
  MdPeople,
  MdReceiptLong,
  MdCreateNewFolder,
  MdOutlineCalendarViewDay,
  MdEdit
} from 'react-icons/md';
import { FaHandHoldingUsd, FaFileInvoiceDollar } from 'react-icons/fa';

export type BranchWidgetKey =
  | 'cr'
  | 'veb'

export type MemberWidgetKey =
  | 'cnm'
  | 'vem';

export type MemberMasterKey =
  | 'gender'
  | 'role'
  | 'status';

export type BranchMasterKey =
  | 'bl'
  | 'country'
  | 'state';
export const MemberDashboardWidgets = [
  {
    key: 'cnm' as MemberWidgetKey,
    title: 'Create New Member',
    icon: MdCreateNewFolder,
    href:'Member-create',
  },
  {
    key: 'vem' as MemberWidgetKey,
    title: 'View/Edit Members',
    icon: MdOutlineCalendarViewDay,
    href:'All-Members',
  },
];

export const BranchDashboardWidgets = [
  {
    key: 'cr' as BranchWidgetKey,
    title: 'Create New Branch',
    icon: MdCreateNewFolder,
    href: 'branch-create',
  },
  {
    key: 'veb' as BranchWidgetKey,
    title: 'View/Edit Branch',
    icon: MdOutlineCalendarViewDay,
    href: 'All-branches',
  }
];
export const MemberMasterWidgets = [
  {
    key: 'gender' as MemberMasterKey,
    title: 'Gender',
    icon: FaHandHoldingUsd,
  },
  {
    key: 'role' as MemberMasterKey,
    title: 'Role',
    icon: MdPeople,
  },
  {
    key: 'status' as MemberMasterKey,
    title: 'Status',
    icon: MdReceiptLong,
  },
];
export const BranchMasterWidgets = [
  {
    key: 'bl' as BranchMasterKey,
    title: 'Branch Level',
    icon: FaFileInvoiceDollar,
  },
  {
    key: 'country' as BranchMasterKey,
    title: 'Country',
    icon: MdAccountBalance,
  },
  {
    key: 'state' as BranchMasterKey,
    title: 'State',
    icon: MdSavings,
  },
];

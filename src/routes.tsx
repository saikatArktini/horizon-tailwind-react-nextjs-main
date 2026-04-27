// import React from 'react';

// // Admin Imports

// // Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson
} from 'react-icons/md';
import { FaCodeBranch } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
// import { BsBank2 } from "react-icons/bs";
// import { TbReportSearch } from "react-icons/tb";

// const routes = [
//   // {
//   //   name: 'Main Dashboard',
//   //   layout: '/admin',
//   //   path: 'default',
//   //   icon: <MdHome className="h-6 w-6" />,
//   // },
//   // {
//   //   name: 'NFT Marketplace',
//   //   layout: '/admin',
//   //   path: 'nft-marketplace',
//   //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,

//   //   secondary: true,
//   // },
//   // {
//   //   name: 'Data Tables',
//   //   layout: '/admin',
//   //   icon: <MdBarChart className="h-6 w-6" />,
//   //   path: 'data-tables',
//   // },
//   {
//     name: 'Admin',
//     layout: '/admin',
//     path: 'branch',
//     icon: <RiAdminFill className="h-6 w-6" />,
//   },
//   {
//     name: 'Member',
//     layout: '/admin',
//     path: 'Member',
//     icon: <FaUser className="h-6 w-6" />,
//   },
//   {
//     name: 'Master',
//     layout: '/admin',
//     path: 'Master',
//     icon: <FaDatabase className="h-6 w-6" />,
//   },
//   {
//     name: 'Banking',
//     layout: '/admin',
//     path: 'Banking',
//     icon: <BsBank2 className="h-6 w-6" />,
//   },
//   {
//     name: 'Reports',
//     layout: '/admin',
//     path: 'Reports',
//     icon: <TbReportSearch className="h-6 w-6" />,
//   },
//   // {
//   //   name: 'Create New Branch',
//   //   layout: '/admin',
//   //   path: 'branch-create',
//   //   icon: <FaCodeBranch className="h-6 w-6" />,
//   // }
//   // {
//   //   name: 'Register New Member',
//   //   layout: '/admin',
//   //   path: 'Member-create',
//   //   icon: <MdPerson className="h-6 w-6" />,
//   // },
//   // {
//   //   name: 'View Members',
//   //   layout: '/admin',
//   //   path: 'All-Members',
//   //   icon: <MdPerson className="h-6 w-6" />,
//   // },
//   // {
//   //   name: 'Profile',
//   //   layout: '/admin',
//   //   path: 'profile',
//   //   icon: <MdPerson className="h-6 w-6" />,
//   // }
//   // {
//   //   name: 'Sign In',
//   //   layout: '/auth',
//   //   path: 'sign-in',
//   //   icon: <MdLock className="h-6 w-6" />,
//   // },
//   // {
//   //   name: 'RTL Admin',
//   //   layout: '/rtl',
//   //   path: 'rtl-default',
//   //   icon: <MdHome className="h-6 w-6" />,
//   // },
// ];
// export default routes;
// import {
//   RiAdminFill,
//   FaUser,
//   FaDatabase,
// } from 'react-icons/all';
import { BsBank2 } from 'react-icons/bs';
import { TbReportSearch } from 'react-icons/tb';

const routes = [
  {
    name: 'Admin',
    layout: '/admin',
    icon: <RiAdminFill className="h-6 w-6" />,
    items: [
      {
        name: 'Create Branch',
        layout: '/admin',
        path: '/branch-create',
        permission: 'CREATE_BRANCH',
      },
      {
        name: 'View/Edit Branches',
        layout: '/admin',
        path: '/All-branches',
        permission: 'CREATE_BRANCH',
      },
    ],
  },

  {
    name: 'New Admin',
    layout: '/admin',
    icon: <RiAdminFill className="h-6 w-6" />,
    items: [
      {
        name: 'Create New Admin',
        layout: '/admin',
        path: '/create-admin',
        permission: 'CREATE_BRANCH',
      },
      {
        name: 'View/Edit Admin',
        layout: '/admin',
        path: '/All-Admins',
        permission: 'UPDATE_BRANCH',
      },
    ],
  },

  {
    name: 'Member',
    layout: '/admin',
    icon: <FaUser className="h-6 w-6" />,
    items: [
      {
        name: 'Create Member',
        layout: '/admin',
        path: '/Member-create',
        permission: 'CREATE_MEMBER',
      },
      {
        name: 'View/Edit Members',
        layout: '/admin',
        path: '/All-Members',
        permission: 'VIEW_MEMBER',
      },
    ],
  },

  {
    name: 'Master',
    layout: '/admin',
    icon: <FaDatabase className="h-6 w-6" />,
    items: [
      {
        name: 'Countries',
        layout: '/admin',
        path: '/master/country',
        permission: 'CREATE_BRANCH',
      },
      {
        name: 'States',
        layout: '/admin',
        path: '/master/state',
        permission: 'CREATE_BRANCH',
      },
      {
        name: 'Branch Levels',
        layout: '/admin',
        path: '/master/branch-level',
        permission: 'CREATE_BRANCH',
      },
      {
        name: 'Member Status',
        layout: '/admin',
        path: '/master/status',
        permission: 'CREATE_BRANCH',
      },
      {
        name: 'Roles',
        layout: '/admin',
        path: '/master/roles',
        permission: 'CREATE_BRANCH',
      },
      {
        name: 'Gender',
        layout: '/admin',
        path: '/master/gender',
        permission: 'CREATE_BRANCH',
      },
    ],
  },

  {
    name: 'Banking',
    layout: '/admin',
    icon: <BsBank2 className="h-6 w-6" />,
    items: [
      {
        name: 'Create Savings Account',
        layout: '/admin',
        path: '/Banking/savings-account/verify-member',
        permission: 'CREATE_ACCOUNT',
      },
      {
        name: 'Create Fixed Deposit ',
        layout: '/admin',
        path: '/Banking/fixed-deposit/verify-member',
        permission: 'CREATE_ACCOUNT',
      },
      {
        name: 'Create Recurring Deposit',
        layout: '/admin',
        path: '/Banking/recurring-deposit/verify-member',
        permission: 'CREATE_ACCOUNT',
      },
      {
        name: 'Create Loan',
        layout: '/admin',
        path: '/Banking/loan/verify-member',
        permission: 'CREATE_ACCOUNT',
      },
      {
        name: 'Create MIS',
        layout: '/admin',
        path: '/Banking/mis/verify-member',
        permission: 'CREATE_ACCOUNT',
      },
    ],
  },

  {
    name: 'Reports',
    layout: '/admin',
    icon: <TbReportSearch className="h-6 w-6" />,
    items: [
      {
        name: 'Member Report',
        layout: '/admin',
        path: '/reports/members',
        permission: 'CREATE_ACCOUNT',
      },
      {
        name: 'Branch Report',
        layout: '/admin',
        path: '/reports/branches',
        permission: 'CREATE_ACCOUNT',
      },
    ],
  },
];

export default routes;

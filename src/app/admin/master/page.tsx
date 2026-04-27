'use client';

import { useEffect, useState } from 'react';
import {
  MdBarChart,
  MdDashboard,
} from 'react-icons/md';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';

import Widget from 'components/widget/Widget';
import { BranchDashboardWidgets, BranchMasterWidgets, MemberDashboardWidgets, MemberMasterWidgets } from 'lib/widgets/branchDashboardWidgets';

const Master = () => {
//   const [stats, setStats] = useState<Record<string, number>>({});

//   useEffect(() => {
//     fetch('/api/dashboard/branch')
//       .then((res) => res.json())
//       .then(setStats);
//   }, []);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">

        {/* <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={'Earnings'}
          subtitle={'$340.5'}
        /> */}

        {MemberMasterWidgets.map((item) => {
          const Icon = item.icon;
          return (
            <Widget
              key={item.key}
              icon={<Icon className="h-7 w-7" />}
              title={item.title}
              subtitle=""
            />
          );
        })}
        {BranchMasterWidgets.map((item) => {
          const Icon = item.icon;
          return (
            <Widget
              key={item.key}
              icon={<Icon className="h-7 w-7" />}
              title={item.title}
              subtitle=""
            />
          );
        })}
      </div>

      {/* Charts */}

      {/* <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 ">
        <TotalSpent />
        <WeeklyRevenue />
      </div> */}

      {/* Tables & Charts */}

      {/* <div className="mt-5  gap-5"> */}
      {/* <CheckTable tableData={tableDataCheck} /> */}
      {/* <DailyTraffic /> */}
      {/* <PieChartCard /> */}
      {/* <ComplexTable tableData={tableDataComplex} /> */}
      {/* <MiniCalendar /> */}
      {/* </div> */}
    </div>
  );
};

export default Master;

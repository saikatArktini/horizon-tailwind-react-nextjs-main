'use client';

import { useRouter } from 'next/navigation';
import Widget from 'components/widget/Widget';
import { BranchDashboardWidgets, MemberDashboardWidgets } from 'lib/widgets/branchDashboardWidgets';

const Member = () => {
  const router = useRouter();

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {MemberDashboardWidgets.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            onClick={() => router.push(item.href)}
            className="cursor-pointer"
          >
            <Widget
              icon={<Icon className="h-7 w-7" />}
              title={item.title}
              subtitle=""
            />
          </div>
        );
      })}
    </div>
  );
};

export default Member;

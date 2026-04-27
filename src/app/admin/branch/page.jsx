'use client';

import { useRouter } from 'next/navigation';
import Widget from 'components/widget/Widget';
import { BranchDashboardWidgets } from 'lib/widgets/branchDashboardWidgets';

const Branch = () => {
  const router = useRouter();

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {BranchDashboardWidgets.map((item) => {
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
            />
          </div>
        );
      })}
    </div>
  );
};

export default Branch;

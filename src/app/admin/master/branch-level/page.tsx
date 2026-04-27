//import BranchLevelsSection from '@/components/branch-level/BranchLevelsSection';

import BranchLevelsSection from "components/branch-level/BranchLevelsSection";

export default function BranchLevelPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Branch Level Management
      </h1>

      <BranchLevelsSection />
    </div>
  );
}

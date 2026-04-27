//import BranchForm from "@/components/branches/BranchForm";

import BranchForm from "components/branches/BranchForm";

export default function CreateBranchPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* <h1 className="text-2xl font-semibold mb-6">
        Create New Branch
      </h1> */}

      <BranchForm />
    </div>
  );
}

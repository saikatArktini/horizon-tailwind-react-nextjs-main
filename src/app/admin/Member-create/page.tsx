// 'use client';

// import { useState } from "react";
// import { branches } from "lib/constants/branches/branchOptions";
// import Widget from "components/widget/Widget";
// import { RiBuilding2Fill } from "react-icons/ri";
// import MemberForm from "components/agents/AgentForm";
// import { FiSearch } from "react-icons/fi";

// export default function MemberCreatePage() {
//   const [selectedBranch, setSelectedBranch] = useState<any>(null);
//   const [search, setSearch] = useState("");

//   const filteredBranches = branches.filter((branch) =>
//     `${branch.name} ${branch.code}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   // STEP 1: Branch Selection
//   if (!selectedBranch) {
//     return (
//       <div className="space-y-6">

//         {/* SEARCH */}
//         <div className="mt-2 p-3 flex items-center rounded-full bg-white border w-full max-w-sm">
//           <FiSearch className="h-4 w-4 text-gray-400 ml-2" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search branch by name or code..."
//             className="ml-2 w-full outline-none text-sm"
//           />
//         </div>

//         <h2 className="text-2xl font-bold">Select Branch</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {filteredBranches.length > 0 ? (
//             filteredBranches.map((branch) => (
//               <div
//                 key={branch.id}
//                 className="cursor-pointer"
//                 onClick={() => setSelectedBranch(branch)}
//               >
//                 <Widget
//                   icon={<RiBuilding2Fill className="h-6 w-6" />}
//                   title={branch.name}
//                   subtitle={branch.code}
//                 />
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500 col-span-full">
//               No branches found
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // STEP 2: Member Form
//   return (
//     <div className="space-y-6">
//       <button
//         onClick={() => setSelectedBranch(null)}
//         className="text-sm text-blue-600 underline"
//       >
//         ← Change Branch
//       </button>

//       <MemberForm branch={selectedBranch} />
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from "react";
import Widget from "components/widget/Widget";
import MemberForm from "components/agents/AgentForm";
import { RiBuilding2Fill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";

type Branch = {
  id: number;
  branchName: string;
  branchCode: string;
};

export default function MemberCreatePage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH BRANCHES FROM BACKEND
  useEffect(() => {
    async function loadBranches() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/branches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBranches(data);
      } catch (error) {
        console.error("Failed to load branches");
      } finally {
        setLoading(false);
      }
    }

    loadBranches();
  }, []);

  const filteredBranches = branches.filter((branch) =>
    `${branch.branchName} ${branch.branchCode}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // STEP 1: BRANCH SELECTION
  if (!selectedBranch) {
    return (
      <div className="space-y-6">

        {/* SEARCH */}
        <div className="mt-2 p-3 flex items-center rounded-full bg-white border w-full max-w-sm">
          <FiSearch className="h-4 w-4 text-gray-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branch by name or code..."
            className="ml-2 w-full outline-none text-sm"
          />
        </div>

        <h2 className="text-2xl font-bold">Select Branch</h2>

        {/* LOADING */}
        {loading && <p className="text-sm text-gray-500">Loading branches...</p>}

        {/* BRANCH LIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!loading && filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="cursor-pointer"
                onClick={() => setSelectedBranch(branch)}
              >
                <Widget
                  icon={<RiBuilding2Fill className="h-6 w-6" />}
                  title={branch.branchName}
                  subtitle={branch.branchCode}
                />
              </div>
            ))
          ) : (
            !loading && (
              <p className="text-sm text-gray-500 col-span-full">
                No branches found
              </p>
            )
          )}
        </div>
      </div>
    );
  }

  //STEP 2: MEMBER FORM
  return (
    <div className="space-y-6">
      <button
        onClick={() => setSelectedBranch(null)}
        className="text-sm text-blue-600 underline"
      >
        ← Change Branch
      </button>

      <MemberForm branch={selectedBranch} />
    </div>
  );
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function AssignBranchDialog({ admin, onClose, onSuccess }: any) {
  const [branches, setBranches] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
   
console.log("13",admin);
  // 🔹 Load branches
  useEffect(() => {
  const token = localStorage.getItem("token");

  setLoading(true);

  fetch("/api/branches", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      setBranches(data);
    //   setSelected(admin.branches ?? []);
    //   console.log("31",data);
    //   console.log("32",admin.branches);
    const assignedIds =
        admin.branches?.map((b: any) =>
          typeof b === "object" ? b.id : Number(b)
        ) ?? [];
      setSelected(assignedIds);
      setLoading(false);
    })
    .catch(err => console.error(err))
    //.finally(() => setLoading(false));
}, [admin.branches]);
     const assignedBranchIds: number[] =
  admin.branches?.map((b: any) =>
    typeof b === "object" ? b.id : Number(b)
  ) ?? [];


  const toggleBranch = (branchId: number) => {
    // 🚫 Do nothing if already assigned (disabled)
    if (admin.branches?.includes(branchId)) return;

    setSelected(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const submit = async () => {
  const token = localStorage.getItem("token");

  const newBranchIds = selected.filter(
    id => !admin.branches.includes(id)
  );

  if (newBranchIds.length === 0) {
    onClose();
    return;
  }

  const res = await fetch("/api/assign-branches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: admin.userId,
      branchIds: newBranchIds,
    }),
  });

  // ✅ Handle both success & error safely
  const contentType = res.headers.get("content-type");

  let payload: any;

  if (contentType?.includes("application/json")) {
    payload = await res.json();
  } else {
    payload = { message: await res.text() };
  }

  if (!res.ok) {
    alert(payload.message || "Something went wrong");
    return;
  }

  // ✅ success
  // alert(payload.message);
  onSuccess();
  onClose();
};

  return (
    <Dialog open onClose={onClose} fullWidth>
  <DialogTitle>Assign Branches</DialogTitle>

  <DialogContent>
    {loading ? (
      <p>Loading branches...</p>
    ) : (
      branches.map(branch => {
  const alreadyAssigned = assignedBranchIds.includes(branch.id);

  return (
    <label
      key={branch.id}
      style={{
        display: "block",
        opacity: alreadyAssigned ? 0.6 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={selected.includes(branch.id)}
        disabled={alreadyAssigned}
        onChange={() => toggleBranch(branch.id)}
      />
      {branch.branchName}
      {alreadyAssigned && " (Already assigned)"}
    </label>
  );
})
    )}
  </DialogContent>

  <DialogActions>
    <Button variant="contained" onClick={submit} disabled={loading}>
      Assign
    </Button>
    <Button variant="outlined" onClick={onClose}>
      Cancel
    </Button>
  </DialogActions>
</Dialog>

  );
}

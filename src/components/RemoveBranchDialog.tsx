import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function RemoveBranchDialog({ admin, onClose, onSuccess }: any) {
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
    console.log("13",admin);
  // ✅ Preload assigned branches
  useEffect(() => {
    const assignedIds =
      admin.branches?.map((b: any) =>
        typeof b === "object" ? b.id : Number(b)
      ) ?? [];

    setSelected(assignedIds);
  }, [admin.branches]);

  const toggleBranch = (branchId: number) => {
    setSelected(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const submit = async () => {
    const token = localStorage.getItem("token");

    const assignedIds =
      admin.branches?.map((b: any) =>
        typeof b === "object" ? b.id : Number(b)
      ) ?? [];

    // 🧮 Branches to REMOVE
    const removedBranchIds = assignedIds.filter(
      id => !selected.includes(id)
    );

    if (removedBranchIds.length === 0) {
      onClose();
      return;
    }

    setLoading(true);

    const res = await fetch("/api/user-branches", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: admin.userId,
        branchIds: removedBranchIds,
      }),
    });

    const payload = await res.json();

    if (!res.ok) {
      alert(payload.message || "Failed to remove branches");
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Remove Branch Access</DialogTitle>

      <DialogContent>
        {admin.role === "Super-Admin" ? (
          <p>Super Admin explicitly has access to all branches</p>
        ) : admin.branches?.length === 0 ? (
          <p>No branches assigned</p>
        ) : (
          admin.branches.map((branch: any) => (
            <label key={branch.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selected.includes(branch.id)}
                onChange={() => toggleBranch(branch.id)}
              />
              {branch.branchName}
            </label>
          ))
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={submit}
          disabled={loading}
        >
          Remove
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

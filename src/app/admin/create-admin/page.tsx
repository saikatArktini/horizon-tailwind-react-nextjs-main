"use client";
//import ApiResponseDialog from "@/components/ApiResponseDialog";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ApiResponseDialog from "components/ApiResponseDialog";
import { useEffect, useState } from "react";

type Branch = {
  id: number;
  branchName: string;
};

export default function CreateAdminPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
const [dialogOpen, setDialogOpen] = useState(false);
const [dialogTitle, setDialogTitle] = useState("");
const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/branches", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setBranches);
  }, []);

  const toggleBranch = (branchId: number) => {
    if (role === "Branch-Admin" && selectedBranches.length >= 1) return;

    setSelectedBranches(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const submit = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");

  const res = await fetch("/api/user-branches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      role,
      branchIds: selectedBranches,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setDialogTitle("Success");
    setDialogMessage(JSON.stringify(data, null, 2));
  } else {
    setDialogTitle("Error");
    setDialogMessage(data.message || "Something went wrong");
  }

  setDialogOpen(true);
  setLoading(false);
};


  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Create Admin
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {/* Username */}
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
          />

          {/* Role */}
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={e => {
                setRole(e.target.value);
                setSelectedBranches([]);
              }}
            >
              <MenuItem value="" selected>Select Role</MenuItem>
              <MenuItem value="Zonal-Admin">Zonal Admin</MenuItem>
              <MenuItem value="Branch-Admin">Branch Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Branch Selection */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select Branches
            </Typography>

            <FormGroup>
              {branches.map(branch => (
                <FormControlLabel
                  key={branch.id}
                  control={
                    <Checkbox
                      checked={selectedBranches.includes(branch.id)}
                      onChange={() => toggleBranch(branch.id)}
                      disabled={role === "Branch-Admin" && selectedBranches.length >= 1}
                    />
                  }
                  label={branch.branchName}
                />
              ))}
            </FormGroup>

            {role === "Branch-Admin" && (
              <Typography variant="caption" color="text.secondary">
                Branch Admin can be assigned only one branch
              </Typography>
            )}
          </Box>

          {/* Submit */}
          <Button
            variant="contained"
            color="primary"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Admin"}
          </Button>
        </Box>
      </Box>
      <ApiResponseDialog
  open={dialogOpen}
  title={dialogTitle}
  message={dialogMessage}
  onClose={() => setDialogOpen(false)}
/>
    </Container>
  );
}

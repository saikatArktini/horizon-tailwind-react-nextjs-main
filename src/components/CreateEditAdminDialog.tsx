import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function CreateEditAdminDialog({ admin, onClose, onSuccess }: any) {
  const [username, setUsername] = useState(admin.username);
  const [isActive, setIsActive] = useState(true);

  const save = async () => {
    const token = localStorage.getItem("token");

    await fetch(`/api/admins/${admin.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, isActive }),
    });

    onSuccess();
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Admin</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

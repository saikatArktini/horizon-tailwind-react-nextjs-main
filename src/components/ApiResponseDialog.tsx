"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export default function ApiResponseDialog({
  open,
  title,
  message,
  onClose,
}: Props) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {message}
          </Typography>

          <IconButton onClick={copyToClipboard} title="Copy">
            <ContentCopyIcon />
          </IconButton>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

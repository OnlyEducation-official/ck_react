"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";

type AuditModalProps = {
  createdby?: string | null;
  createdat?: string | null;
  updatedby?: string | null;
  updatedat?: string | null;
};

export default function AuditModalButton({
  createdby,
  createdat,
  updatedby,
  updatedat,
}: AuditModalProps) {
  const [open, setOpen] = React.useState(false);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
  };

  const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, textAlign: "right", maxWidth: 280 }}
        noWrap
        title={typeof value === "string" ? value : undefined}
      >
        {value ?? "—"}
      </Typography>
    </Stack>
  );

  const hasUpdates = Boolean(updatedby || updatedat);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<HistoryIcon />}
        onClick={() => setOpen(true)}
        sx={{ borderRadius: 2 }}
        disabled={!createdby && !createdat}
      >
        View Audit
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Audit Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Creation & update history
              </Typography>
            </Stack>

            <Tooltip title="Close">
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                label={hasUpdates ? "Updated" : "Created"}
              />
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                Created
              </Typography>
              <Row label="Created By" value={createdby} />
              <Row label="Created At" value={formatDate(createdat)} />

              <Divider sx={{ my: 0.5 }} />

              <Typography variant="overline" color="text.secondary">
                Updated
              </Typography>
              <Row label="Updated By" value={updatedby} />
              <Row label="Updated At" value={formatDate(updatedat)} />

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Times are shown in your local timezone.
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} variant="contained" sx={{ borderRadius: 2 }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

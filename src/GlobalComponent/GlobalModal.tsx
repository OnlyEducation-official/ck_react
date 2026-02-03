import {
  Box,
  Modal,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

type GlobalModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number | string;
};

export default function GlobalModal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 520,
}: GlobalModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: maxWidth },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          outline: "none",
        }}
      >
        {/* Header */}
        {title && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={1.5}
            >
              <Typography variant="h6">{title}</Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
            <Divider />
          </>
        )}

        {/* Body */}
        <Box px={2} py={2}>
          {children}
        </Box>

        {/* Footer */}
        {footer && (
          <>
            <Divider />
            <Box px={2} py={1.5}>
              {footer}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

import { Box } from "@mui/material";
import React from "react";
import ProfileForm from "./ProfileForm";

export default function UserProfilePage() {
  return (
    <Box
      sx={{
        paddingBlockStart: 10,
        paddingInline: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <ProfileForm />
    </Box>
  );
}

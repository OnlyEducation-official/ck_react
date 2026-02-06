
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileForm from "./ProfileForm";

type user = {
  "teacher_name": string | null,
  "teacher_surname": string | null,
  "teacher_bio": string | null,
  "teacher_contact": number | null,
  "teacher_email": string | null,
  "teacher_dob": Date | null
}

export default function UserProfilePage() {

  return (
    <Box sx={{ paddingBlockStart: 10, paddingInline: { xs: 2, sm: 4, md: 6 } }}>
      <ProfileForm />
    </Box>
  );
}

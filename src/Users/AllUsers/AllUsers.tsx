import { Link } from 'react-router-dom';
import { Box, Button, Typography, Stack } from "@mui/material";
import UserList from './components/UserList';
import AddIcon from "@mui/icons-material/Add";

export default function AllUsers() {
  return (
    <Box
      sx={{
        maxWidth: 1280,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 12
      }}
    >
      {/* HEADER SECTION */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4, // Clean semantic spacing between header and list
        }}
      >
        {/* Title & Description Context */}
        <Stack spacing={0.5}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.5px"
            }}
          >
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system directories, update permission roles, and track registration logs.
          </Typography>
        </Stack>

        {/* Action Call to Action */}
        <Button
          component={Link}
          to="/add-users"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          disableElevation
          sx={{
            fontWeight: 600,
            textTransform: "none", // Avoids aggressive all-caps rendering
            px: 2.5,
            py: 1,
            borderRadius: 2, // Modern rounded corners
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            width: { xs: "100%", sm: "auto" }, // Mobile full-width safety fallback
          }}
        >
          Add New User
        </Button>
      </Box>

      {/* CONTENT LIST CARD PANEL */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", // Soft clean modern depth shadows
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden"
        }}
      >
        <UserList />
      </Box>
    </Box>
  );
}
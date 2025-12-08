import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 3
            }}
        >
            <Typography variant="h2" fontWeight="bold" color="error" gutterBottom>
                404
            </Typography>

            <Typography variant="h5" gutterBottom>
                Page Not Found
            </Typography>

            <Typography variant="body1" sx={{ maxWidth: 450, mb: 3 }}>
                The page you are trying to access does not exist or has been moved.
            </Typography>

            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/questions-list"
                sx={{ textTransform: "none", px: 4, py: 1.2 }}
            >
                Questions List page
            </Button>
        </Box>
    );
}

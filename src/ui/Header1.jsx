import { styled, alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Sidebar from "../GlobalComponent/Sidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function DrawerAppBar() {
  const { token, logout } = useContext(AuthContext);
  console.log("token: ", token);
  const navBtn = [
    {
      label: "Exams Category",
      url: "/test-exams-category-list",
    },
    {
      label: "Exam",
      url: "/exams-list",
    },
    {
      label: "Subject Category",
      url: "/test-subject-category-list",
    },
    {
      label: "Subject",
      url: "/test-subject-list",
    },
    {
      label: "Subject Chapter",
      url: "/test-chapter-list",
    },
    {
      label: "Questions",
      url: "/questions-list",
    },
    {
      label: "Topic",
      url: "/test-topic-list",
    },
  ];
  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ "& .MuiToolbar-root": { padding: 0 } }}>
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: 64,
              px: { xs: 2, sm: 3 },
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton> */}
              <Typography
                variant="h5"
                noWrap
                component={Link}
                to={"/questions-list"}
                sx={{
                  display: { xs: "block" },
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "white",
                }}
              >
                ONLY TEST
              </Typography>
              <Stack direction={"row"} gap={3}>
                {navBtn.map((btn, index) => (
                  <Typography
                    variant="subtitle1"
                    noWrap
                    component={Link}
                    to={btn.url}
                    key={index}
                    sx={{
                      flexGrow: 1,
                      display: { xs: "none", md: "block" },
                      fontWeight: 600,
                      color:
                        location.pathname === btn.url
                          ? "common.white"
                          : "common.black",
                      textDecoration: "none",
                      position: "relative",
                      px: 2,
                      py: 1,
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "0%",
                        height: "2px",
                        bottom: 0,
                        left: 0,
                        backgroundColor: "black",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    {btn.label}
                  </Typography>
                ))}
              </Stack>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <Sidebar />
              </Box>
            </Box>
            <Button
              onClick={() => logout()}
              sx={{
                px: 3.5,
                py: 1.4,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                letterSpacing: "0.3px",
                color: "#fff",
                background: token
                  ? "linear-gradient(135deg, #34d399, #059669)" // Logout → Green
                  : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                transition: "all 0.25s ease",

                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
                  background: token
                    ? "linear-gradient(135deg, #059669, #047857)"
                    : "linear-gradient(135deg, #7c3aed, #5b21b6)",
                },

                "&:active": {
                  transform: "scale(0.97)",
                },
              }}
            >
              {token ? "Logout" : "Login"}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default DrawerAppBar;

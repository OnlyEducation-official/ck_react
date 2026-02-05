import { styled, alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, IconButton, Stack, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Sidebar from "../GlobalComponent/Sidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthDropdown from "./AuthDropdown"

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
  const { token } = useContext(AuthContext);
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
      label: "Subject",
      url: "/test-subject-list",
    },
    {
      label: "Category",
      url: "/test-subject-category-list",
    },
    {
      label: "Chapter",
      url: "/test-chapter-list",
    },
    {
      label: "Topic",
      url: "/test-topic-list",
    },
    {
      label: "Questions",
      url: "/questions-list",
    }
  ];
  const location = useLocation();

  return (
    <>
      {token && (
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
                  <Typography
                    variant="h5"
                    noWrap
                    component={Link}
                    to="/questions-list"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    ONLY TEST
                  </Typography>

                  <Stack direction="row" sx={{ columnGap: { md: 2, lg: 3 } }}>
                    {navBtn.map((btn, index) => (
                      <Typography
                        key={index}
                        variant="subtitle2"
                        component={Link}
                        to={btn.url}
                        sx={{
                          fontSize: "15px",
                          display: { xs: "none", md: "block" },
                          fontWeight: 600,
                          color:
                            location.pathname === btn.url
                              ? "common.white"
                              : "common.black",
                          textDecoration: "none",
                          position: "relative",
                          px: 1,
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

                <AuthDropdown />
              </Toolbar>
            </Container>
          </AppBar>
        </Box>
      )}
    </>

  );
}

export default DrawerAppBar;

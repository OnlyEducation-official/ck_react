"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import { AuthContext } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function AuthDropdown() {
  const { token, logout } = React.useContext(AuthContext);

  // Replace these with your real values/functions
  // const token = true; // boolean or string
  // const logout = () => console.log("logout");
  // const login = () => console.log("login");
  // const goToProfile = () => console.log("profile");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleLogin = () => {
    handleClose();
    // login();
  };



  return (
    <>
      <Tooltip title={token ? "Account" : "Login"}>
        <IconButton onClick={handleOpen} sx={{ ml: { md: 2 } }}>
          {token ? (
            <Avatar sx={{ width: 34, height: 34 }}>
              <PersonIcon fontSize="small" />
            </Avatar>
          ) : (
            <LoginIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 6,
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 200,
            overflow: "visible",
          },
        }}
      >
        {token ? (
          <Box>
            <MenuItem>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>

              <Typography
                variant="subtitle2"
                noWrap
                component={Link}
                to="/profile"
                sx={{
                  fontSize: "15px",
                  flexGrow: 1,
                  display: { xs: "none", md: "block" },
                  fontWeight: 600,
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
                Profile
              </Typography>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Box>
        ) : (
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

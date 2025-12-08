import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link, useLocation } from "react-router-dom";
import { IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  FolderTree,
  FileText,
  Grid3x3,
  BookOpen,
  BookMarked,
  HelpCircle,
  List as ListIcon,
} from "lucide-react";
const sidebarData = [
  {
    label: "Exams Category",
    url: "/test-exams-category-list",
    icon: FolderTree,
  },
  {
    label: "Exam",
    url: "/exams-list",
    icon: FileText,
  },
  {
    label: "Subject Category",
    url: "/test-subject-category",
    icon: Grid3x3,
  },
  {
    label: "Subject",
    url: "/test-subject-category-list",
    icon: BookOpen,
  },
  {
    label: "Subject Chapter",
    url: "/test-chapter-list",
    icon: BookMarked,
  },
  {
    label: "Questions",
    url: "/questions-list",
    icon: HelpCircle,
  },
  {
    label: "Topic",
    url: "/test-topic-list",
    icon: ListIcon,
  },
];

export default function Sidebar() {
  const [state, setState] = React.useState(false);
  const location = useLocation();
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Stack
        spacing={1}
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Typography
          variant="h5"
          noWrap
          component={Link}
          to={"/questions-list"}
          sx={{
            display: { xs: "block" },
            fontWeight: 600,
            textDecoration: "none",
            color: "black",
          }}
        >
          ONLY TEST
        </Typography>
        <IconButton onClick={toggleDrawer(false)} sx={{ padding: 0.5 }}>
          <CloseIcon sx={{ color: "black" }} />
        </IconButton>
      </Stack>

      <Divider />
      <List>
        {sidebarData.map((obj, index) => {
          const Icons = obj.icon || BookOpen;
          return (
            <ListItem key={obj.label} disablePadding>
              <ListItemButton
                component={Link}
                to={obj.url}
                selected={location.pathname === obj.url} // <-- Active highlight
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    "& .MuiListItemIcon-root": { color: "white" },
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                <ListItemIcon>
                  <Icons
                    size={25}
                    color={location.pathname === obj.url ? "white" : "black"}
                  />
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                </ListItemIcon>
                <ListItemText primary={obj.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {/* 
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List> */}
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Button onClick={toggleDrawer(true)} sx={{ color: "white" }}>
          <MenuIcon />
        </Button>
        <Drawer
          anchor={"right"}
          open={state}
          onClose={() => toggleDrawer(false)}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

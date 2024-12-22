import React, { useState } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, styled, useTheme, Typography, Tooltip } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { HomeOutlined } from "@mui/icons-material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import { useLocation, useNavigate } from "react-router-dom";
import { Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { grey } from "@mui/material/colors";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Array1 = [
  { text: "Dashboard", icon: <HomeOutlinedIcon />, path: "/dashboard" },
  { text: "Buildings", icon: <LocationCityOutlinedIcon />, path: "/buildings/list" },
  { text: "Apartments", icon: <ApartmentOutlinedIcon />, path: "/apartments/list" },
  { text: "Rooms", icon: <HomeOutlinedIcon />, path: "/rooms/list" },
  { text: "Available Rooms", icon: <HomeOutlinedIcon />, path: "/rooms/available" },


];

const Array2 = [
  {
    text: "Reservations",
    icon: <PersonOutlinedIcon />,
    path: "/bookings",
    subItems: [
      { text: "All Reservations", icon: <CalendarMonthIcon />, path: "/bookings/list" },
      { text: "Today Check in", icon: <CalendarMonthIcon />, path: "/bookings/today-check-in" },
      { text: "Today Check out",  icon: <CalendarMonthIcon />,path: "/bookings/today-check-out" },
    ],
  },
  { text: "Customers", icon: <PeopleOutlinedIcon />, path: "/customers" },
  { text: "Users", icon: <HelpOutlineOutlinedIcon />, path: "/users" },
];



const SideBar = ({ open, handleDrawerClose }) => {
  let location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  


  const [openMenu, setOpenMenu] = useState({});

  const handleToggle = (path) => {
    setOpenMenu((prev) => ({ ...prev, [path]: !prev[path] }));
  };


  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Avatar
        sx={{
          mx: "auto",
          width: open ? 88 : 44,
          height: open ? 88 : 44,
          my: 1,
          border: "2px solid grey",
          transition: "0.25s",
        }}
        alt="Remy Sharp"
        src={localStorage.getItem('personal_photo')}
      />
      <Typography
        align="center"
        sx={{ fontSize: open ? 17 : 0, transition: "0.25s" }}
      >
     {localStorage.getItem('full_name')}
      </Typography>
      <Typography
        align="center"
        sx={{
          fontSize: open ? 15 : 0,
          transition: "0.25s",
          color: theme.palette.info.main,
        }}
      >
        Admin
      </Typography>

      <Divider />

      <List>
      {Array1.map((item) => (
        <>
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? null : item.text} placement="left">
              <ListItemButton
                onClick={() =>
                  item.children ? handleToggle(item.text) : navigate(item.path)
                }
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : grey[300]
                      : null,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
                {item.children && (openSubMenu === item.text ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>
          </ListItem>
          {item.children && (
            <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((subItem) => (
                  <ListItem key={subItem.path} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(subItem.path)}
                      sx={{
                        pl: open ? 4 : 2,
                        bgcolor:
                          location.pathname === subItem.path
                            ? theme.palette.mode === "dark"
                              ? grey[800]
                              : grey[300]
                            : null,
                      }}
                    >
                      <ListItemText primary={subItem.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
        </>
      ))}
    </List>

      <Divider />

      <List>
      {Array2.map((item) => (
        <div key={item.path}>
          <ListItem disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? null : item.text} placement="left">
              <ListItemButton
                onClick={() =>
                  item.subItems ? handleToggle(item.path) : navigate(item.path)
                }
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : grey[300]
                      : null,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                { open ? item.subItems && (openMenu[item.path] ?  <ExpandLess /> : <ExpandMore />) : ""}
              </ListItemButton>
            </Tooltip>
          </ListItem>

          {item.subItems && (
            <Collapse in={openMenu[item.path]} timeout="auto" unmountOnExit>
              {item.subItems.map((subItem) => (
                <ListItem
                  key={subItem.path}
                  disablePadding
                  sx={{ pl: 4 }}
                  onClick={() => navigate(subItem.path)}
                >
                  <ListItemButton>
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </Collapse>
          )}
        </div>
      ))}
  

      </List>

      <Divider />

      {/* <List>
        {Array3.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? null : item.text} placement="left">
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : grey[300]
                      : null,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List> */}
    </Drawer>
  );
};

export default SideBar;

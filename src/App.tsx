import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import { getDesignTokens } from "./theme";
import { Outlet, useNavigate } from "react-router-dom";
import Login from "./Login";
import { BuildingsProvider } from "./context/BuildingsContext";
import { RoomTypesProvider } from "./context/RoomTypesContext";
import { ReservationTypesProvider } from "./context/ReservationTypesContext";
import { ReservationStatusesProvider } from "./context/ReservationStatusesContext";
import { NationalitiesProvider } from "./context/NationalitiesContext";
import { LeadSourcesProvider } from "./context/LeadSourcesContext";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [mode, setMode] = React.useState("light");
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const handleLogin = () => {
    // Add your login logic here
    // For example, set isLoggedIn to true upon successful login
    setIsLoggedIn(true);
    // Redirect the user to the dashboard after login
    navigate("/dashboard");
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For example, set isLoggedIn to false upon logout
    setIsLoggedIn(false);
    // Redirect the user to the login page after logout
    navigate("/login");
  };

  if (localStorage.getItem("user_token") == undefined) {
    // Render login page without sidebar
    return <Login handleLogin={handleLogin} handleLogout={handleLogout} />;
  }

  // Render the dashboard with sidebar if user is logged in
  return (
    <ThemeProvider theme={theme}>
      <BuildingsProvider>
      <RoomTypesProvider>
      <ReservationTypesProvider>
      <ReservationStatusesProvider>
      <NationalitiesProvider>
      <LeadSourcesProvider>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <TopBar
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            setMode={setMode}
            handleLogout={handleLogout}
          />
          <SideBar open={open} handleDrawerClose={handleDrawerClose} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Outlet />
          </Box>
        </Box>
      </LeadSourcesProvider>
      </NationalitiesProvider>
     </ReservationStatusesProvider>
     </ReservationTypesProvider>
      </RoomTypesProvider>
      </BuildingsProvider>
    </ThemeProvider>
  );
}

// Example Login component

import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import { styled, alpha } from "@mui/material/styles";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Modal,
  Tooltip,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import Header from "../../components/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import Divider from "@mui/material/Divider";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useBuildingsContext } from "../../context/BuildingsContext";
import { useRoomTypesContext } from "../../context/RoomTypesContext";
import { useReservationTypesContext } from "../../context/ReservationTypesContext";
import { useNationalitiesContext } from "../../context/NationalitiesContext";
import { useReservationStatusesContext } from "../../context/ReservationStatusesContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Bookings = () => {

  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const {
    reservation_statuses,
    loading: reservationStatusesloading,
    error: reservationStatusesError,
  } = useReservationStatusesContext();
  const {
    buildings,
    loading: buildingLoading,
    error: buildingError,
  } = useBuildingsContext();
  const {
    reservation_types,
    loading: reservationTypesLoading,
    error: reservationTypesError,
  } = useReservationTypesContext();
  const {
    room_types,
    loading: roomTypeLoading,
    error: roomTypeError,
  } = useRoomTypesContext();
  const { nationalities, nationalitiesloading, nationalitiesError } =
    useNationalitiesContext();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [apartmentLoading, setApartmentLoading] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedReservationStatus, setSelectedReservationStatus] =
    useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedRow, setSelectedRow] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const theme = useTheme();
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);
  const [reservations, setReservations] = useState({});

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/reservations`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      });

      const data = await response.json();

      if (data.statusCode == 200) {
        setReservations(data.data.reservations[0]); // Replace reservations state with the updated list
      } else {
        console.error("Error fetching reservations:", data.message);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    // fetch("http://127.0.0.1:8000/api/reservations", {
    //   headers: {
    //     Accept: "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setReservations(data.data.reservations[0]);
    //     console;
    //   })
    //   .catch((error) => console.error("Error fetching data:", error));
    fetchReservations();
  }, []);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleViewDetails = () => {
    setSelectedReservation(selectedRow);
    setShowDetailsModal(true);
    handleClose();
  };

  useEffect(() => {
    if (selectedBuilding) {
      fetchApartments(selectedBuilding.id);
    } else {
      setApartments([]);
    }
  }, [selectedBuilding]);

  const fetchApartments = async (buildingId) => {
    setApartmentLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/buildings/${buildingId}/apartments`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch apartments");
      const data = await response.json();
      const extractedApartments = data.data.apartments.flat();
      setApartments(extractedApartments);
    } catch (err) {
      console.error(err.message);
    } finally {
      setApartmentLoading(false);
    }
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const [customers, setCustomers] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogDetails, setDialogDetails] = useState({
    title: "",
    content: "",
    reservation_id: "",
    status_id: "",
  });

  const handleOpenDialog = (status_id, reservation_id, title, content) => {
    setDialogDetails({ status_id, reservation_id, title, content });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = async () => {
    const { status_id, reservation_id } = dialogDetails;

    try {
      const response = await fetch(
        `http://localhost:8000/api/reservations/update-status`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
          body: JSON.stringify({
            reservation_id: reservation_id,
            status_id: status_id,
          }), // إرسال القيمة في الـ body
        }
      );

      const data = await response.json();

      if (data.statusCode == 200) {
        setSnackbar({
          open: true,
          message: data.message || "Reservation successfully created!",
          severity: "success",
        });

        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === reservation_id
              ? { ...reservation, ...data.data.reservation } // Replace with updated data
              : reservation
          )
        );
      } else {
        console.error("Error fetching data:", data.message);
        setSnackbar({
          open: true,
          message: `Validation error: ${data.message}`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }

    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleActionClick = (status_id, reservation_id) => {
    switch (status_id) {
      case 2:
        handleOpenDialog(
          status_id,
          reservation_id,
          "Confirm Reservation",
          "Are you sure you want to confirm this reservation?"
        );
        break;
      case 5:
        handleOpenDialog(
          status_id,
          reservation_id,
          "Cancel Reservation",
          "Are you sure you want to cancel this reservation?"
        );
        break;
      case 3:
        handleOpenDialog(
          status_id,
          reservation_id,
          "Check-In Guest",
          "Are you sure you want to check-in the guest?"
        );
        break;
      case 4:
        handleOpenDialog(
          status_id,
          reservation_id,
          "Check-Out Guest",
          "Are you sure you want to check-out the guest?"
        );
        break;
      default:
        console.log("Unknown action:", status_id);
    }
  };
  const handleSearch = async (value) => {
    if (!value) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/customers/search`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
          body: JSON.stringify({ search: value }), // إرسال القيمة في الـ body
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCustomers(data.data.customers[0]); // تحديث القائمة بالبيانات
      } else {
        console.error("Error fetching data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const statusColors = {
    1: "warning",
    2: "success",
    3: "info",
    4: "default",
    5: "error",
    6: "error",
    7: "warning",
    8: "warning",
    9: "error",
    10: "info",
    11: "default",
  };
  // field ==> Reqird
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "apartment",
      headerName: "Apartment",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        const buildingName = params.row.room.building;
        return `${buildingName || "N/A"} / ${
          params.row.room.apartment || "N/A"
        }`;
      },
    },
    {
      field: "room",
      headerName: "room",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.room.room_name || "N/A",
    },
    {
      field: "room_type_id",
      headerName: "Room Type",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.room.room_type.name || "N/A",
    },
    {
      field: "full_name",
      headerName: "Customer Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        const buildingName = params.row.customer.first_name;
        return `${buildingName || "N/A"}  ${
          params.row.customer.last_name || "N/A"
        }`;
      },
    },
    {
      field: "check_in_date",
      headerName: "Check in",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "check_out_date",
      headerName: "Check Out",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { id, name, description } = params.row.status;
        return (
          <Tooltip title={description || "No description available"} arrow>
            <Box
              sx={{
                p: "5px",
                width: "120px",
                borderRadius: "3px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Chip
                label={name}
                color={statusColors[id] || "default"}
                size="small"
              />
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { id, name } = params.row.status;
        return (
          <>
    <Button
      id={`demo-customized-button-${params.row.id}`} // استخدام id خاص بالصف
      aria-controls={selectedRow?.id === params.row.id ? "demo-customized-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={selectedRow?.id === params.row.id ? "true" : undefined}
      variant="contained"
      disableElevation
      onClick={(event) => handleClick(event, params.row)}
      endIcon={<KeyboardArrowDownIcon />}
    >
      Options
    </Button>

    <StyledMenu
      id="demo-customized-menu"
      MenuListProps={{
        "aria-labelledby": `demo-customized-button-${params.row.id}`, // استخدام نفس id
      }}
      anchorEl={selectedRow?.id === params.row.id ? anchorEl : null}
      open={selectedRow?.id === params.row.id}
      onClose={handleClose}
    >
      {/* التعامل مع الشرط الأول */}
      {id === 1 && (
        <>
          <MenuItem onClick={() => handleActionClick(2, params.row.id)} disableRipple>
            <CheckCircleIcon />
            Confirm
          </MenuItem>
          <MenuItem onClick={() => handleActionClick(5, params.row.id)} disableRipple>
            <CancelIcon />
            Cancel
          </MenuItem>
        </>
      )}

      {/* التعامل مع الشرط الثاني */}
      {id === 2 && (
        <MenuItem onClick={() => handleActionClick(3, params.row.id)} disableRipple>
          <MeetingRoomIcon />
          Check-In
        </MenuItem>
      )}

      {/* التعامل مع الشرط الثالث */}
      {id === 3 && (
        <MenuItem onClick={() => handleActionClick(4, params.row.id)} disableRipple>
          <ExitToAppIcon />
          Check-Out
        </MenuItem>
      )}
      
      {/* عرض View Details دائمًا في أسفل القائمة */}
      <Divider sx={{ my: 0.5 }} />
      <MenuItem onClick={handleViewDetails} disableRipple>
        <VisibilityIcon />
        View Details
      </MenuItem>
    </StyledMenu>

    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>{dialogDetails.title}</DialogTitle>
      <DialogContent>{dialogDetails.content}</DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirmAction} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </>
        );
      },
    },
  ];

  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          isDashboard={true}
          title={"Reservations"}
          // subTitle={"Welcome to your dashboard"}
        />
      </Stack>
      <Box sx={{ padding: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{ flex: 1 }}
            label={"check in date"}
            views={["year", "month", "day"]}
            onChange={(newValue) =>
              setFilters((prev) => ({ ...prev, check_in_date: newValue }))
            }
          />
          <DatePicker
            sx={{ flex: 1 }}
            label={"check out date"}
            views={["year", "month", "day"]}
            onChange={(newValue) =>
              setFilters((prev) => ({ ...prev, check_out_date: newValue }))
            }
          />
        </LocalizationProvider>
        <Autocomplete
          sx={{ flex: 1 }}
          options={buildings}
          getOptionLabel={(option) => option.name}
          value={selectedBuilding}
          onChange={(e, value) => {
            setSelectedBuilding(value);
            setFilters((prev) => ({ ...prev, building_id: value?.id }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Building" />
          )}
        />
        <Autocomplete
          sx={{ flex: 1 }}
          options={apartments}
          getOptionLabel={(option) => option.name}
          value={selectedApartment}
          onChange={(e, value) => {
            setSelectedApartment(value);
            setFilters((prev) => ({ ...prev, apartment_id: value?.id }));
          }}
          loading={apartmentLoading}
          renderInput={(params) => (
            <TextField {...params} label="Choose Apartment" />
          )}
        />
      </Box>
      <Box sx={{ padding: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Autocomplete
          sx={{ flex: 1 }}
          options={customers}
          getOptionLabel={(option) =>
            `${option.full_name} - ${option.phone_number}`
          }
          value={selectedCustomer}
          onChange={(e, value) => setSelectedCustomer(value)}
          onInputChange={(e, value) => {
            handleSearch(value); // استدعاء البحث عند الكتابة
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search of Customer" />
          )}
        />

        <Autocomplete
          sx={{ flex: 1 }}
          options={reservation_statuses}
          getOptionLabel={(option) => option.name}
          value={selectedReservationStatus}
          onChange={(e, value) => {
            setSelectedReservationStatus(value);
            setFilters((prev) => ({ ...prev, status_id: value?.id }));
          }}
          renderInput={(params) => <TextField {...params} label="Status" />}
        />

        <Autocomplete
          sx={{ flex: 1 }}
          options={room_types}
          getOptionLabel={(option) => option.name}
          value={selectedRoomType}
          onChange={(e, value) => {
            setSelectedRoomType(value);
            setFilters((prev) => ({ ...prev, room_type_id: value?.id }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Room Type" />
          )}
        />
        <Autocomplete
          sx={{ flex: 1 }}
          options={room_types}
          getOptionLabel={(option) => option.name}
          value={selectedRoomType}
          onChange={(e, value) => {
            setSelectedRoomType(value);
            setFilters((prev) => ({ ...prev, room_type_id: value?.id }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Room Type" />
          )}
        />
        <Button variant="contained" color="primary">
          Filter
        </Button>
      </Box>
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={reservations}
          columns={columns}
        />
      </Box>
      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <Box
          sx={{
            width: 1200,
            backgroundColor: "white",
            padding: 3,
            margin: "auto",
            marginTop: 10,
          }}
        >
          <Typography variant="h6">Reservation Details</Typography>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                variant="fullWidth"
                sx={{ width: "100%" }}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Reservation Details" {...a11yProps(0)} />
                <Tab label="Customer Details" {...a11yProps(1)} />
                <Tab label="Other Informaion" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableBody>
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 650 }}
                        aria-label="Reservation Details"
                      >
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell>Customer Name</StyledTableCell>
                            <StyledTableCell>
                              {`${selectedReservation?.customer?.first_name} ${selectedReservation?.customer?.last_name}` ||
                                "N/A"}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell>Building</StyledTableCell>
                            <StyledTableCell>
                              {selectedReservation?.room?.building || "N/A"}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell>Apartment</StyledTableCell>
                            <StyledTableCell>
                              {selectedReservation?.room?.apartment || "N/A"}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell>Room Type</StyledTableCell>
                            <StyledTableCell>
                              {selectedReservation?.room?.room_type?.name ||
                                "N/A"}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell>Check-in Date</StyledTableCell>
                            <StyledTableCell>
                              {dayjs(selectedReservation?.check_in_date).format(
                                "YYYY-MM-DD"
                              ) || "N/A"}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell>Check-out Date</StyledTableCell>
                            <StyledTableCell>
                              {dayjs(
                                selectedReservation?.check_out_date
                              ).format("YYYY-MM-DD") || "N/A"}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell>
                              <Chip
                                label={selectedReservation?.status.name}
                                color={
                                  statusColors[
                                    selectedReservation?.status.id
                                  ] || "default"
                                }
                                size="small"
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Reservation Details">
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        First name
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.first_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        last Name
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.last_name || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Phone number
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.phone_number || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        gender
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.gender?.name || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Nationality
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.nationality?.name ||
                          "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        email{" "}
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.email || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Note
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.note || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Id photo
                      </StyledTableCell>
                      <StyledTableCell>
                        <img
                          width={400}
                          src={`http://localhost:8000/image/${selectedReservation?.customer?.id_photo}`}
                          alt="ID Photo"
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Passport photo
                      </StyledTableCell>
                      <StyledTableCell>
                        <img
                          width={200}
                          src={`http://localhost:8000/image/${selectedReservation?.customer?.passport_photo}`}
                          alt="ID Photo"
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Reservation Details">
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Lead by
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.first_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Viewid by
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.last_name || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Lead by
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.first_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Viewid by
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.customer?.last_name || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Created by
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.user?.first_name || "N/A"}{" "}
                        {selectedReservation?.user?.last_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Date of adding the reservation{" "}
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.reservation_date || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        commission
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.user?.first_name || "N/A"}{" "}
                        {selectedReservation?.user?.last_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Total Amount
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedReservation?.reservatiototal_amountn_date ||
                          "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Contract photo
                      </StyledTableCell>
                      <StyledTableCell>
                        <img
                          width={200}
                          src={`http://localhost:8000/image/${selectedReservation?.customer?.passport_photo}`}
                          alt="ID Photo"
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Bookings;

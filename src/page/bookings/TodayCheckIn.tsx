import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from 'dayjs';
import "../../index.css";
import {
  Typography, Box,Stack,Modal,TextField,FormGroup,Button,Checkbox,FormControlLabel, MenuItem, Autocomplete
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { useBuildingsContext } from "../../context/BuildingsContext";
import { useRoomTypesContext } from "../../context/RoomTypesContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stepper from "@mui/material/Stepper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
const TodayCheckIn = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null); // New state to track selected room for bed spaces
  const [bedSpaces, setBedSpaces] = useState([]);
  // Fetch options for building, apartment, and room type (dummy options for now)
  const {
    buildings,
    loading: buildingLoading,
    error: buildingError,
  } = useBuildingsContext();
  const {
    room_types,
    loading: roomTypeLoading,
    error: roomTypeError,
  } = useRoomTypesContext();
  const [apartments, setApartments] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [apartmentLoading, setApartmentLoading] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  
  const [filters, setFilters] = useState({
    check_in_date: "",
    building_id: "",
    apartment_id: "",
    room_type_id: "",
  });

  const [selectedRoomInfo, setSelectedRoomInfo] = useState({});

  const [inputValue, setInputValue] = useState(''); // القيمة المدخلة في الحقل
  const [searchLoading , setSearchloading] = useState(false); // حالة التحميل


  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  }; 


  const [showCheckInConfirmationModal, setShowCheckInConfirmationModal] = useState(false);
const [reservationToConfirm, setReservationToConfirm] = useState(null);

const handleConfirmCheckIn = (reservation) => {
  setReservationToConfirm(reservation);
  setShowCheckInConfirmationModal(true);
};

  // Fetch available rooms on button click


  useEffect(() => {
    fetchBookings(filters);
  }, [filters]);

  // دالة لجلب البيانات مع الفلاتر
  const fetchBookings = (filters) => {
    fetch("http://127.0.0.1:8000/api/today-check-in", {
      method: "POST", // استخدام POST لإرسال البيانات في body
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
      body: JSON.stringify(filters), // إرسال الفلاتر كـ JSON
    })
      .then((response) => response.json())
      .then((data) => {
        setRooms(data.data.reservations[0]); // حفظ النتائج في الحالة
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // دالة تحديث الفلاتر عند الضغط على زر الفلتر
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchBookings(filters);
  };



  // Handle changes in filters
 

  

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



 
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "full_name",
      headerName: "Customer Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        const buildingName = params.row.customer.first_name ;
        return `${buildingName || "N/A"}  ${params.row.customer.last_name  || "N/A"}`;
      },
    }, {
      field: "apartment",
      headerName: "Apartment",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        const buildingName = params.row.room.building ;
        return `${buildingName || "N/A"} / ${params.row.room.apartment || "N/A"}`;
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
      field: "actions",
      headerName: "Actions",
      width: 400,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleViewDetails(params.row)}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleConfirmCheckIn(params.row)}
            sx={{ ml: 2 }}
          >
            Confirm Check-In
          </Button>
        </>
      ),
    },
  ];

 




  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Header
          isDashboard={true}
         title="Today CheckIn"
          // subTitle="Filter and find available rooms"
        />
      </Stack>

      {/* Filter Section */}
      <Box sx={{ padding: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
    
            {/* <DatePicker
              sx={{ flex: 1 }}
            
              label={"check in date"}
              views={["year", "month", "day"]}
              onChange={(newValue) =>
                setFilters((prev) => ({ ...prev, check_in_date: newValue }))
              }
            /> */}
    
   
        </LocalizationProvider>
        <Autocomplete
          sx={{ flex: 1 }}
          options={buildings}
          getOptionLabel={(option) => option.name}
          value={selectedBuilding}
          onChange={(e, value) => {
            setSelectedBuilding(value);
            setFilters(prev => ({ ...prev, building_id: value?.id }));
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
            setFilters(prev => ({ ...prev, apartment_id: value?.id }));
          }}
          loading={apartmentLoading}
          renderInput={(params) => (
            <TextField {...params} label="Choose Apartment" />
          )}
        />
      
      <Autocomplete
          sx={{ flex: 1 }}
          options={room_types}
          getOptionLabel={(option) => option.name}
          value={selectedRoomType}
          onChange={(e, value) => {
            setSelectedRoomType(value);
            setFilters(prev => ({ ...prev, room_type_id: value?.id }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Room Type" />
          )}
        />
 <Button  variant="contained" color="primary" onClick={applyFilters}>
 <FilterAltIcon />  Filter
        </Button>
    
      </Box>

      {/* Data Grid */}
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          rows={rooms}
          // @ts-ignore
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>

   

      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
  <Box sx={{ width: 600, backgroundColor: "white", padding: 3, margin: "auto", marginTop: 10 }}>
    <Typography variant="h6">Reservation Details</Typography>
    <Box>
      <Typography><strong>Customer Name:</strong> {selectedReservation?.customer?.full_name}</Typography>
      <Typography><strong>Building:</strong> {selectedReservation?.room?.building}</Typography>
      <Typography><strong>Apartment:</strong> {selectedReservation?.room?.apartment}</Typography>
      <Typography><strong>Room Type:</strong> {selectedReservation?.room?.room_type?.name}</Typography>
      <Typography><strong>Check-in Date:</strong> {dayjs(selectedReservation?.check_in_date).format("YYYY-MM-DD")}</Typography>
      <Typography><strong>Check-out Date:</strong> {dayjs(selectedReservation?.check_out_date).format("YYYY-MM-DD")}</Typography>
      {/* أضف تفاصيل أخرى حسب الحاجة */}
    </Box>
    <Button sx={{ marginTop: 2 }} variant="contained" onClick={() => setShowDetailsModal(false)}>
      Close
    </Button>
  </Box>
</Modal>


<Dialog
        open={showCheckInConfirmationModal}
        onClose={() => setShowCheckInConfirmationModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Check-In ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure you want to confirm the check-in for this reservation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained"
      color="success" onClick={() => handleConfirmReservation(reservationToConfirm)} autoFocus>
            Agree
          </Button>
          <Button   variant="outlined"
      color="error"  onClick={() => setShowCheckInConfirmationModal(false)}>Disagree</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default TodayCheckIn;

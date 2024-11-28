import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from 'dayjs';
import {
  Typography, Box, Autocomplete,Stack,Modal,TextField,FormGroup,Button,Checkbox,FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useBuildingsContext } from "../../context/BuildingsContext";
import { useRoomTypesContext } from "../../context/RoomTypesContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
const RoomsAvailability = () => {
  const navigate = useNavigate();
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
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [apartmentLoading, setApartmentLoading] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasBathroom, setHasBathroom] = useState(false);
  const steps = [
    "Booking Information",
    "Customer Information",
    "Other Information",
  ];
  const [filters, setFilters] = useState({
    check_in_date: "",
    check_out_date: "",
    building_id: "",
    apartment_id: "",
    min_price:"",
    max_price: "",
    room_type_id: "",
    has_balcony: hasBalcony,
    has_bathroom: hasBathroom,
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [showReservationModal, setShowReservationModal] = useState(false);


  const handleAddReservationClick = (roomId) => {
    // setSelectedRoomId(roomId); // Existing function to set room ID
    setShowReservationModal(true); // Show reservation modal
  };
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
  });
  
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };
  const CheckboxField = ({ label, checked, onChange }) => (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} />}
      label={label}
    />
  );
  // Fetch available rooms on button click
  const fetchRooms = async () => {
    try {
      const formattedFilters = {
        ...filters,
        check_in_date: filters.check_in_date && dayjs(filters.check_in_date).isValid() ? dayjs(filters.check_in_date).format("YYYY-MM-DD") : "", check_out_date: filters.check_out_date && dayjs(filters.check_out_date).isValid() ? dayjs(filters.check_out_date).format("YYYY-MM-DD") : "",
      };

      // Make an API request with the filters
      const response = await fetch("http://localhost:8000/api/rooms/availability", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        body: JSON.stringify(formattedFilters),
      });
      const data = await response.json();
      setRooms(data.data.rooms[0]);
    } catch (error) {
      console.error("Error fetching room availability:", error);
    }
  };




  const fetchBedSpaces = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/rooms/${roomId}/bedspaces`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      });

      const data = await response.json();
      setBedSpaces(data.data.bed_spaces[0]);
    } catch (error) {
      console.error("Error fetching bed spaces:", error);
    }
  };

  const handleBedSpaceClick = (roomId) => {
    setSelectedRoomId(roomId); // Set selected room ID
    fetchBedSpaces(roomId); // Fetch bed spaces for the selected room
  };
  // Handle changes in filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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

  const bedSpacesColumns = [
    {
      field: "id",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Room Name",
      flex: 1,
      headerName: "Room Name",
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.room?.name || "N/A",
    },
    {
      field: "bed_number",
      flex: 1,
      headerName: "Bed Number",
      align: "center",
      headerAlign: "center",
     
    },
    {
      field: "position_description",
      flex: 1,
      headerName: "Position Description",
      align: "center",
      headerAlign: "center",

    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,  
      width: 400,
      renderCell: (params) => (
        <>
         <Button
          variant="outlined"
          sx={{ margin: 1 }}
          onClick={() => handleBedSpaceClick(params.row.id)}
        >
          Add Reservation
        </Button>
        </>
      ),
    },
  ];

  const handleSubmitReservation = async () => {
    if (!customerInfo.fullName || !customerInfo.email || !filters.check_in_date || !filters.check_out_date) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify({
          room_id: selectedRoomId,
          check_in_date: filters.check_in_date,
          check_out_date: filters.check_out_date,
          customer_info: customerInfo,
          price: rooms.find((r) => r.id === selectedRoomId)?.price,
        }),
      });
  
      if (response.ok) {
        alert("Reservation successfully created!");
        setShowReservationModal(false);
        fetchRooms(); // Refresh the room list
      } else {
        const error = await response.json();
        alert(`Failed to create reservation: ${error.message}`);
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
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
      field: "name",
      headerName: "Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "room_types",
      headerName: "Room Types",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.room_type?.name || "N/A",
    },
    {
      field: "apartment",
      headerName: "Apartment",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        const buildingName = buildings.find(b => b.id === params.row.apartment?.building_id)?.name;
        return `${buildingName || "N/A"} / ${params.row.apartment?.name || "N/A"}`;
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },{
      field: "actions",
      headerName: "Actions",
      width: 400,
      renderCell: (params) => (
        <>
         {params.row.room_type?.id === 3 && (  // Assuming 3 is the "Bed Space" room type ID
        <Button
          variant="outlined"
          sx={{ margin: 1 }}
          onClick={() => handleBedSpaceClick(params.row.id)}
        >
          View Bed Spaces
        </Button>
      )}
        {params.row.room_type?.id !== 3 && (  // Assuming 3 is the "Bed Space" room type ID
        <Button
          variant="outlined"
          sx={{ margin: 1 }}
          onClick={() => handleAddReservationClick(params.row.id)}
        >
          Add Reservation
        </Button>
      )}
        </>
      ),
    },
  ];

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box
           
        
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            noValidate
            autoComplete="off"
          >
            {/* Select Building & Apartment */}
            <Stack sx={{ gap: 2 , width: "100%" }} direction={"row"} >
          
              <LocalizationProvider dateAdapter={AdapterDayjs}>
               
                  <DatePicker
                    sx={{ flex: 1 }}
                    label={"check in date"}
                    views={["year", "month", "day"]}
                  />
                  <DatePicker
                    sx={{ flex: 1 }}
                    label={"check in date"}
                    views={["year", "month", "day"]}
                  />
         
              </LocalizationProvider>
            </Stack>
            <Stack sx={{ gap: 2 }} direction={"row"}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={buildings}
                getOptionLabel={(option) => option.name}
                value={selectedBuilding}
                onChange={(e, value) => setSelectedBuilding(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Building" />
                )}
              />

              <Autocomplete
                sx={{ flex: 1 }}
                options={apartments}
                getOptionLabel={(option) => option.name}
                value={selectedApartment}
                onChange={(e, value) => setSelectedApartment(value)}
                loading={apartmentLoading}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Apartment" />
                )}
              />
            </Stack>

            {/* Room Name & Type */}
            <Stack sx={{ gap: 2 }} direction={"row"}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={room_types}
                getOptionLabel={(option) => option.name}
                value={selectedRoomType}
                onChange={(e, value) => setSelectedRoomType(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Room Type" />
                )}
              />

            
            </Stack>
          </Box>
        );
      case 1:
        return (
          <>
          </>
        );
      case 2:
        return (
     
          <>
          <Button variant="contained" color="primary" onClick={handleSubmitReservation}>
       Confirm Reservation
     </Button>
         </> 
       
     
        );
      case 3:
        return (
      

          <>
          <Button variant="contained" color="primary" onClick={handleSubmitReservation}>
       Confirm Reservation
     </Button>
         </> 
          
        );
      default:
        return <Typography>انتهت الخطوات!</Typography>;
    }
  };


  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Header
          isDashboard={true}
          title="ROOM AVAILABILITY"
          subTitle="Filter and find available rooms"
        />
      </Stack>

      {/* Filter Section */}
      <Box sx={{ padding: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <Stack sx={{ gap: 2 }} direction={"row"} >
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
          </Stack>
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
      
       

        {/* <Button variant="contained" color="primary" onClick={fetchRooms}>
          Find Available Rooms
        </Button> */}
      </Box>
      <Box sx={{ padding: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
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

          
<TextField
        sx={{ flex: 1 }}
      type="number"
      label="Min Price"
      onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
    />
    <TextField
    sx={{ flex: 1 }}
      type="number" 
      label="Max Price"
      onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
    />
      <FormGroup sx={{ flex: 1 }}>
          <Stack sx={{ gap: 2 }} direction={"row"}>
            <CheckboxField
              label="Has Balcony"
              checked={hasBalcony}
              onChange={(e) => setHasBalcony(e.target.checked)}
            />
            <CheckboxField
              label="Has Bathroom"
              checked={hasBathroom}
              onChange={(e) => setHasBathroom(e.target.checked)}
            />
          </Stack>
        </FormGroup>
 
   
       

        <Button variant="contained" color="primary" onClick={fetchRooms}>
          Find Available Rooms
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

      <Modal
        open={Boolean(selectedRoomId)}
        onClose={() => setSelectedRoomId(null)}
        aria-labelledby="bedspace-modal-title"
        aria-describedby="bedspace-modal-description"
      >
        <Box sx={{ width: 1200, backgroundColor: "white", padding: 2, margin: "auto", marginTop: 10 }}>
          <Typography variant="h6" id="bedspace-modal-title">
            Bed Spaces for Room {selectedRoomId}
          </Typography>
          <Box>
            {bedSpaces.length > 0 ? (
              <DataGrid
              rows={bedSpaces}
              // @ts-ignore
              columns={bedSpacesColumns}
              getRowId={(row) => row.id}
            />
            ) : (
              <Typography>No bed spaces available.</Typography>
            )}
          </Box>
        </Box>
      </Modal>


      <Modal
  open={showReservationModal}
  onClose={() => setShowReservationModal(false)}
>
<Box sx={{ width: 1200, backgroundColor: "white", padding: 2, margin: "auto", marginTop: 10 }}>
    <Typography variant="h6">Add Reservation</Typography>
    <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Typography sx={{ mt: 2, mb: 1 }}>تمت جميع الخطوات!</Typography>
      ) : (
        <React.Fragment>
          <Box sx={{ mt: 2, mb: 1 }}>
            {renderStepContent(activeStep)} {/* عرض المحتوى بناءً على الخطوة */}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
  
  </Box>
</Modal>
    </Box>
  );
};

export default RoomsAvailability;

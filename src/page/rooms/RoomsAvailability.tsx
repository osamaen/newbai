import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";
import "../../index.css";
import {
  Typography,
  Box,
  Stack,
  Modal,
  TextField,
  FormGroup,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { useBuildingsContext } from "../../context/BuildingsContext";
import { useRoomTypesContext } from "../../context/RoomTypesContext";
import { useReservationTypesContext } from "../../context/ReservationTypesContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stepper from "@mui/material/Stepper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useNationalitiesContext } from "../../context/NationalitiesContext";
import { useLeadSourcesContext } from "../../context/LeadSourcesContext";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
const RoomsAvailability = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null); // New state to track selected room for bed spaces
  const [bedSpaces, setBedSpaces] = useState([]);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
   const [genderId, setGenderId] = useState("");
  // استيراد اللودر والتنبيه
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // حالات جديدة
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // Fetch options for building, apartment, and room type (dummy options for now)
  const {
    lead_sources,
    loading: leadSourcesLoading,
    error: leadSourcesError,
  } = useLeadSourcesContext();
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
  const [apartments, setApartments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [apartmentLoading, setApartmentLoading] = useState(false);
  const [isBedspace, setIsBedspace] = useState(0);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasBathroom, setHasBathroom] = useState(false);
  const steps = [
    "Booking Information",
    "Customer Information",
    "Other Information",
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(null); // الزبون المحدد
  const [selectedEmployee, setSelectedEmployee] = useState(null); // الزبون المحدد
  
  const handleGenderChange = (event) => {
    setGenderId(event.target.value); // Update genderId state
  };
  const handleCustomerSelection = () => {
    if (selectedCustomer) {
      // تأكيد الزبون الموجود وإغلاق النموذج
      console.log("تم اختيار الزبون:", selectedCustomer);
    } else {
      // إضافة زبون جديد
      console.log("إضافة زبون جديد:", newCustomer);
    }
  };
  const [filters, setFilters] = useState({
    check_in_date: "",
    check_out_date: "",
    building_id: "",
    apartment_id: "",
    min_price: "",
    max_price: "",
    room_type_id: "",
    gender_id: "",
    has_balcony: hasBalcony,
    has_bathroom: hasBathroom,
  });

  const [selectedRoomInfo, setSelectedRoomInfo] = useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [nationalityId, setNationalityId] = useState(null);
  const [reservationType, setReservationType] = useState(null);

  const [inputValue, setInputValue] = useState(""); // القيمة المدخلة في الحقل
  const [searchLoading, setSearchloading] = useState(false); // حالة التحميل
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // useEffect(() => {
  //   setFilters({
  //     ...filters,
  //     gender_id: genderId,
  //   });
  // }, [genderId]);

  // دالة البحث عن العملاء باستخدام API
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
  const handleAddReservationClick = (row) => {
    setSelectedRoomInfo(row); // Existing function to set room ID
    setActiveStep(0);
    setShowReservationModal(true); // Show reservation modal
  };

  const [newCustomerInfo, setCustomerInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    national_id: "",
    lead_by: "",
    lead_source_id: "",
    gender_id: "", // إضافة gender_id
    passport_photo: null, // إضافة passport_photo
    id_photo: null, // إضافة id_photo
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
        check_in_date:
          filters.check_in_date && dayjs(filters.check_in_date).isValid()
            ? dayjs(filters.check_in_date).format("YYYY-MM-DD")
            : "",
        check_out_date:
          filters.check_out_date && dayjs(filters.check_out_date).isValid()
            ? dayjs(filters.check_out_date).format("YYYY-MM-DD")
            : "",
      };

      // Make an API request with the filters
      const response = await fetch(
        "http://localhost:8000/api/rooms/availability",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
          body: JSON.stringify(formattedFilters),
        }
      );
      const data = await response.json();
      setRooms(data.data.rooms[0]);
    } catch (error) {
      console.error("Error fetching room availability:", error);
    }
  };

  const fetchBedSpaces = async (roomId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/rooms/${roomId}/bedspaces`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );

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

  const handleBookingTypeChange = (selectedTypeId) => {
    const selectedType = reservation_types.find(
      (type) => type.id === selectedTypeId
    );

    if (filters.check_in_date && filters.check_out_date) {
      const checkInDate = dayjs(filters.check_in_date);
      const checkOutDate = dayjs(filters.check_out_date);
      const daysDifference = checkOutDate.diff(checkInDate, "day");

      if (daysDifference >= selectedType.minimum_stay_days) {
        setShowErrorAlert(false);
        setReservationType(selectedTypeId); // يسمح بالتحديد
      } else {
        setReservationType(null);
        setErrorMessage(
          `The selected booking type requires a minimum stay of ${selectedType.minimum_stay_days} days. Please choose a different type or extend your stay.`
        );
        setShowErrorAlert(true);
      }
    } else {
      setReservationType(selectedTypeId); // إذا لم يتم تحديد التواريخ بعد
    }
  };

  useEffect(() => {
    if (selectedBuilding) {
      fetchApartments(selectedBuilding.id);
    } else {
      setApartments([]);
 
    }
    fetchEmployees();
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



  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/employees`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.statusCode == 200){
        setEmployees(data.data.employees[0]);
      }
      
    } catch (err) {
      console.error(err.message);
    } finally {
      // setApartmentLoading(false);
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
  const [customPrice, setCustomPrice] = useState(0);

  const handlePassportPhotoChange = (e) => {
    const file = e.target.files[0];
    setPassportPhoto(
      file ? { file, preview: URL.createObjectURL(file) } : null
    );
  };

  const handleIdPhotoChange = (e) => {
    const file = e.target.files[0];
    setIdPhoto(file ? { file, preview: URL.createObjectURL(file) } : null);
  };

  const handleSubmitReservation = async () => {
    if (!filters.check_in_date || !filters.check_out_date) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("room_id", selectedRoomInfo.id);
    formData.append(
      "check_in_date",
      dayjs(filters.check_in_date).format("YYYY-MM-DD")
    );
    formData.append(
      "check_out_date",
      dayjs(filters.check_out_date).format("YYYY-MM-DD")
    );

    formData.append("type_id", reservationType);
    formData.append("total_amount", customPrice);
    formData.append("is_bedspace", isBedspace ? 1 : 0);

    selectedCustomer
      ? formData.append("customer_id", selectedCustomer.id)
      : formData.append("customer", newCustomerInfo);

    // إضافة الصور إلى الـ FormData
    if (idPhoto) {
      formData.append("passport_photo", idPhoto);
    }
    if (passportPhoto) {
      formData.append("id_photo", passportPhoto);
    }

    try {
      const response = await fetch("http://localhost:8000/api/reservations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: formData,
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
        const buildingName = params.row.building?.name;
        return `${buildingName || "N/A"} / ${
          params.row.apartment?.name || "N/A"
        }`;
      },
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
      width: 400,
      renderCell: (params) => (
        <>
          {params.row.room_type?.id === 3 && ( // Assuming 3 is the "Bed Space" room type ID
            <Button
              variant="outlined"
              sx={{ margin: 1 }}
              onClick={() => handleBedSpaceClick(params.row.id)}
            >
              View Bed Spaces
            </Button>
          )}
          {params.row.room_type?.id !== 3 && ( // Assuming 3 is the "Bed Space" room type ID
            <Button
              variant="outlined"
              sx={{ margin: 1 }}
              onClick={() => handleAddReservationClick(params.row)}
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

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleSave = async () => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      // Ensure required fields are filled
      if (!filters.check_in_date || !filters.check_out_date) {
        alert("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("room_id", selectedRoomInfo.id);
      formData.append(
        "check_in_date",
        dayjs(filters.check_in_date).format("YYYY-MM-DD")
      );
      formData.append(
        "check_out_date",
        dayjs(filters.check_out_date).format("YYYY-MM-DD")
      );
      formData.append("type_id", reservationType);
      formData.append("total_amount", customPrice);
      formData.append("is_bedspace", isBedspace ? 1 : 0);

      if (selectedCustomer) {
        formData.append("customer_id", selectedCustomer.id);
      } else {
        formData.append("customer", JSON.stringify(newCustomerInfo)); // Stringify nested object
      }

      if (idPhoto) {
        formData.append("id_photo", idPhoto);
      }
      if (passportPhoto) {
        formData.append("passport_photo", passportPhoto);
      }

      const response = await fetch("http://localhost:8000/api/reservations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: formData,
      });

      const responseData = await response.json(); // Parse response data

      // Check the statusCode in the response
      //   if (responseData.statusCode === 200) {
      //     alert(responseData.message || "Reservation successfully created!");
      //     setShowReservationModal(false);
      //     fetchRooms(); // Refresh the room list
      //   } else if (responseData.statusCode >= 400 && responseData.statusCode < 500) {
      //     // Handle client-side errors
      //     alert(`Validation error: ${responseData.message}`);
      //     console.error("Error details:", responseData.errors);
      //   } else if (responseData.statusCode >= 500) {
      //     // Handle server-side errors
      //     alert("An unexpected error occurred. Please try again later.");
      //     console.error("Server error:", responseData.message);
      //   } else {
      //     alert("Something went wrong. Please try again.");
      //   }
      // } catch (error) {
      //   console.error("Error submitting reservation:", error);
      //   alert("An error occurred while submitting the reservation. Please try again.");
      // } finally {
      //   setLoading(false); // Always stop the loading spinner
      // }

      if (responseData.statusCode === 200) {
        setSnackbar({
          open: true,
          message: responseData.message || "Reservation successfully created!",
          severity: "success",
        });
        setShowReservationModal(false);
        fetchRooms();
      } else if (
        responseData.statusCode >= 400 &&
        responseData.statusCode < 500
      ) {
        setSnackbar({
          open: true,
          message: `Validation error: ${responseData.message}`,
          severity: "error",
        });
        console.error("Error details:", responseData.errors);
      } else if (responseData.statusCode >= 500) {
        setSnackbar({
          open: true,
          message: "An unexpected error occurred. Please try again later.",
          severity: "error",
        });
        console.error("Server error:", responseData.message);
      } else {
        setSnackbar({
          open: true,
          message: "Something went wrong. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setSnackbar({
        open: true,
        message:
          "An error occurred while submitting the reservation. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (
      filters.check_in_date &&
      filters.check_out_date &&
      selectedRoomInfo?.price
    ) {
      const checkInDate = dayjs(filters.check_in_date);
      const checkOutDate = dayjs(filters.check_out_date);
      const monthsDifference = checkOutDate.diff(checkInDate, "month", true); // لحساب الفرق بالأشهر بدقة
      return Math.ceil(monthsDifference) * selectedRoomInfo.price;
    }
    return 0;
  };

  const totalPrice = calculateTotalPrice();

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            noValidate
            autoComplete="off"
          >
            <Stack sx={{ gap: 2 }} direction={"row"}>
              {/* اختيار نوع الحجز */}
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Booking Type</InputLabel>
                <Select
                  value={reservationType}
                  label="Booking Type"
                  onChange={(e) => handleBookingTypeChange(e.target.value)}
                >
                  {reservation_types?.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            {/* Select Building & Apartment */}
            <Stack sx={{ gap: 2, width: "100%" }} direction={"row"}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  readOnly
                  sx={{ flex: 1 }}
                  defaultValue={filters.check_in_date}
                  label={"check in date"}
                  views={["year", "month", "day"]}
                />
                <DatePicker
                  readOnly
                  sx={{ flex: 1 }}
                  defaultValue={filters.check_out_date}
                  label={"check out date"}
                  views={["year", "month", "day"]}
                />
              </LocalizationProvider>
            </Stack>
            <Stack sx={{ gap: 2 }} direction={"row"}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={buildings}
                getOptionLabel={(option) => option.name}
                value={selectedRoomInfo.building}
                onChange={(e, value) => setSelectedBuilding(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Building" />
                )}
                readOnly
              />

              <Autocomplete
                // disabled
                sx={{ flex: 1 }}
                options={apartments}
                getOptionLabel={(option) => option.name}
                value={selectedRoomInfo.apartment}
                onChange={(e, value) => setSelectedApartment(value)}
                loading={apartmentLoading}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Apartment" />
                )}
                readOnly
              />
            </Stack>

            <Stack sx={{ gap: 2 }} direction={"row"}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={room_types}
                getOptionLabel={(option) => option.name}
                value={selectedRoomInfo.room_type}
                onChange={(e, value) => setSelectedRoomType(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Room Type" />
                )}
                readOnly
              />
              <TextField
                sx={{ flex: 1 }}
                label="Room Name"
                value={selectedRoomInfo.name}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Stack>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* البحث عن الزبون */}
            <Autocomplete
              sx={{ flex: 1 }}
              options={customers}
              getOptionLabel={(option) =>
                `${option.full_name} - ${option.phone_number}`
              }
              value={selectedCustomer}
              onChange={(e, value) => setSelectedCustomer(value)}
              onInputChange={(e, value) => {
                setInputValue(value); // تحديث النص المدخل
                handleSearch(value); // استدعاء البحث عند الكتابة
              }}
              loading={searchLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search of Customer"
                  placeholder="Enter Name or Phone Number"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <span>Loading...</span> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* إضافة زبون جديد إذا لم يتم العثور عليه */}
            {!selectedCustomer && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack sx={{ gap: 2 }} direction={"row"}>
                  <TextField
                    sx={{ flex: 1 }}
                    label="First Name"
                    value={newCustomerInfo.first_name}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...newCustomerInfo,
                        first_name: e.target.value,
                      })
                    }
                    error={errors.first_name ? true : false}
                    helperText={errors.first_name && errors.first_name}
                  />
                  <TextField
                    sx={{ flex: 1 }}
                    label="Last Name"
                    value={newCustomerInfo.last_name}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...newCustomerInfo,
                        last_name: e.target.value,
                      })
                    }
                    error={errors.last_name ? true : false}
                    helperText={errors.last_name && errors.last_name}
                  />
                </Stack>
                <Stack sx={{ gap: 2 }} direction={"row"}>
                  <Autocomplete
                    sx={{ flex: 1 }}
                    options={nationalities}
                    getOptionLabel={(option) => option.name}
                    value={nationalityId}
                    onChange={(e, value) => setNationalityId(value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Choose Nationality" />
                    )}
                  />

                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel id="demo-simple-select-label">
                      source of lead
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="source of lead"
                      onChange={(e) =>
                        setCustomerInfo({
                          ...newCustomerInfo,
                          lead_source_id: e.target.value,
                        })
                      }
                    >
                      {leadSourcesLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : leadSourcesError ? (
                        <MenuItem disabled>Error loading lead sources</MenuItem>
                      ) : (
                        lead_sources.map((source) => (
                          <MenuItem key={source.id} value={source.id}>
                            {source.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>

                  <Autocomplete
              sx={{ flex: 1 }}
              options={employees}
              getOptionLabel={(option) =>
                `${option.full_name}`
              }
              // value={selectedEmployee}
              // onChange={(e, value) => setSelectedEmployee(value)}

              onChange={(e) =>
                
                setCustomerInfo({
                  ...newCustomerInfo,
                  lead_by: e.target.value,
                })

              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lead BY"
                  placeholder="Enter Name"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <span>Loading...</span> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
                </Stack>
                <Stack sx={{ gap: 2 }} direction={"row"}>
                  <TextField
                    sx={{ flex: 1 }}
                    label="Email"
                    value={newCustomerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...newCustomerInfo,
                        email: e.target.value,
                      })
                    }
                    error={errors.email ? true : false}
                    helperText={errors.email && errors.email}
                  />
                  <TextField
                    sx={{ flex: 1 }}
                    label="Phone Number"
                    value={newCustomerInfo.phone_number}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...newCustomerInfo,
                        phone_number: e.target.value,
                      })
                    }
                    error={errors.phone_number ? true : false}
                    helperText={errors.phone_number && errors.phone_number}
                  />
                </Stack>
                <Stack sx={{ gap: 2 }} direction={"row"}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ flex: 1 }}
                      label={"Date of Birth"}
                      views={["year", "month", "day"]}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...newCustomerInfo,
                          date_of_birth: e.target.value,
                        })
                      }
                      // onChange={(newValue) => setDateOfBirth(newValue)} // تعيين القيمة مباشرة هنا
                    />
                  </LocalizationProvider>
                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                      error={errors.gender_id ? true : false}
                      labelId="gender-select-label"
                      id="gender-select"
                      label="Gender"
                      value={newCustomerInfo.gender_id}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...newCustomerInfo,
                          gender_id: e.target.value,
                        })
                      }
                      name="gender_id"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="1">Male</MenuItem>
                      <MenuItem value="2">Female</MenuItem>
                    </Select>

                    {/* Display error if it exists */}
                    {errors.gender_id && (
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {errors.gender_id}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>

                <Stack sx={{ gap: 2 }} direction="row">
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    sx={{ flex: 1 }}
                    label="Id Photo"
                    onChange={handleIdPhotoChange} // تحديث الصورة
                    error={errors.id_photo ? true : false}
                    helperText={errors.id_photo && errors.id_photo}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    sx={{ flex: 1 }}
                    label="Passport Photo"
                    onChange={handlePassportPhotoChange} // تحديث الصورة
                    error={errors.passport_photo ? true : false}
                    helperText={errors.passport_photo && errors.passport_photo}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack sx={{ gap: 2 }} direction={"row"}>
                  <TextField
                    sx={{ flex: 1 }}
                    label="Total Price"
                    value={totalPrice}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    sx={{ flex: 1 }}
                    label="Enter Rental Price"
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    error={customPrice < totalPrice}
                    helperText={
                      customPrice < totalPrice
                        ? "The entered price cannot be less than the total price."
                        : ""
                    }
                  />
                </Stack>
              </Box>
            </Box>
            {/* <Button sx={{ marginTop: 2,textAlign:"right" }}  variant="contained" color="primary" onClick={handleSubmitReservation}>
       Confirm Reservation
     </Button> */}
          </>
        );
      case 3:
        return (
          <>
            {/* <Button variant="contained" color="primary" onClick={handleSubmitReservation}>
       Confirm Reservation
     </Button> */}
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
       <FormControl sx={{ flex: 1 }}>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              error={errors.gender_id ? true : false}
              labelId="gender-select-label"
              id="gender-select"
              label="gender"
              value={filters.gender_id}
              onChange={(e) =>
                setFilters({
                  ...filters, 
                  gender_id: e.target.value, 
                })
              }
              
              
              // Add the onChange handler
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="1">Male</MenuItem>
              <MenuItem value="2">Female</MenuItem>
            </Select>

            {/* Display error if it exists */}
            {errors.gender_id && (
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.gender_id}
              </FormHelperText>
            )}
          </FormControl>

        <TextField
          sx={{ flex: 1 }}
          type="number"
          label="Min Price"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, min_price: e.target.value }))
          }
        />
        <TextField
          sx={{ flex: 1 }}
          type="number"
          label="Max Price"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, max_price: e.target.value }))
          }
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
        <Box
          sx={{
            width: 1200,
            backgroundColor: "white",
            padding: 2,
            margin: "auto",
            marginTop: 10,
          }}
        >
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
        <Box
          sx={{
            width: 1200,
            backgroundColor: "white",
            padding: 2,
            margin: "auto",
            marginTop: 10,
          }}
        >
          <Typography variant="h6">Add Reservation</Typography>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Box
              sx={{
                mt: 2,
                mb: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "200px",
              }}
            >
              {loading ? (
                <CircularProgress size={60} />
              ) : success ? (
                <Box sx={{ textAlign: "center" }}>
                  <Alert severity="success">
                    Reservation Created Successfully
                  </Alert>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewReservation()}
                    >
                      view the reservation
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setShowReservationModal(false)}
                      sx={{ ml: 2 }}
                    >
                      close
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography>Reservation Created Successfully</Typography>
              )}
            </Box>
          ) : (
            <>
              <Box sx={{ mt: 2, mb: 1 }}>
                {showErrorAlert && (
                  <Alert
                    severity="error"
                    onClose={() => setShowErrorAlert(false)}
                    sx={{ margin: "20px" }}
                  >
                    {errorMessage}
                  </Alert>
                )}
                {renderStepContent(activeStep)}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    activeStep === steps.length - 1 ? handleSave : handleNext
                  }
                  disabled={loading}
                >
                  {activeStep === steps.length - 1
                    ? loading
                      ? "Saving..."
                      : "Save"
                    : "Next"}
                </Button>
              </Box>
            </>
          )}

          {error && (
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={() => setError(null)}
            >
              <Alert onClose={() => setError(null)} severity="error">
                {error}
              </Alert>
            </Snackbar>
          )}
        </Box>
      </Modal>

      {/* Your form or modal components here */}
      {/* <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button> */}

      {/* Snackbar component */}
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

export default RoomsAvailability;

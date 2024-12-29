import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, Autocomplete, Stack } from "@mui/material";
// import { DateRangePicker } from "date-range-react-picker";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useBuildingsContext } from "../../context/BuildingsContext";
import { useRoomTypesContext } from "../../context/RoomTypesContext";
import { useReservationTypesContext } from "../../context/ReservationTypesContext";
import { Height } from "@mui/icons-material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import "react-datepicker/dist/react-datepicker.css";

const AddBooking = () => {
  const steps = [
    "Select campaign settings",
    "Create an ad group",
    "Create an ad",
  ];
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
  const {
    reservation_types,
    loading: ReservationTypesLoading,
    error: ReservationTypesError,
  } = useReservationTypesContext();

  const handleClose = () => {
    setShowAlert(false);
  };
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/add-doctor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify({}),
      });

      const content = await response.json();
      //  console.log(content.errors);
      if (content.statusCode == 200) {
        // يمكنك هنا إجراء أي إجراءات تريدها بعد الاستجابة الناجحة من الخادم.
        setShowAlert(true);
      } else {
        // console.log(content.errors);
        setErrors(content.errors);
        // setShowAlert(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

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

  const [userState, setUserState] = useState(null);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [apartmentLoading, setApartmentLoading] = useState(false);
  const isStepOptional = (step: number) => {
    return step === 1;
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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  useEffect(() => {
    if (selectedBuilding) {
      fetchApartments(selectedBuilding.id);
    } else {
      setApartments([]);
    }
  }, [selectedBuilding]);
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box
            onSubmit={handleSubmit}
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            noValidate
            autoComplete="off"
          >
            {/* Select Building & Apartment */}
            <Stack sx={{ gap: 2 }} direction={"row"}>
              {/* <DateRangePicker
            weekStartDay="1"
            containerWidth="600px"
            textBoxWidth="400px"
            getDateRangeState={setUserState}
            applyFunc={() => console.log("Apply from parent")}
            cancelFunc={() => console.log("Cancel from parent")}
            dateFormatShow="DD MMMM,YYYY"
          /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ gap: 2 }} direction={"row"}>
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
                </Stack>
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

              <TextField
                sx={{ flex: 1 }}
                label="Room Name"
                // value={name}
                // onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Stack>
          </Box>
        );
      case 1:
        return (
          <DateRangePicker
            startText="تاريخ الوصول"
            endText="تاريخ المغادرة"
            // value={dateRange}
            // onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <TextField {...endProps} />
              </>
            )}
          />
        );
      case 2:
        return (
          <DateRangePicker
            startText="تاريخ الوصول"
            endText="تاريخ المغادرة"
            // value={dateRange}
            // onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <TextField {...endProps} />
              </>
            )}
          />
        );
      case 3:
        return (
          <DateRangePicker
            startText="تاريخ الوصول"
            endText="تاريخ المغادرة"
            // value={dateRange}
            // onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <TextField {...endProps} />
              </>
            )}
          />
        );
      default:
        return <Typography>انتهت الخطوات!</Typography>;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
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
    //     <Box>
    //       <Header title="CREATE BOOKING" subTitle="Create a New Booking" />
    //       {showAlert && (
    //         <Alert severity="success" onClose={handleClose} sx={{ margin: "20px" }}>
    //           saved successfull
    //         </Alert>
    //       )}
    //       <Box
    //         onSubmit={handleSubmit}
    //         component="form"
    //         sx={{
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: 3,
    //         }}
    //         noValidate
    //         autoComplete="off"
    //       >

    //       <>
    //           <Box sx={{ flexGrow: 1 }}>
    //       <Grid container spacing={2}>
    //         <Grid item xs={6}>
    //         <FormControl sx={{ width: "100%"  }}>
    //             <InputLabel id="demo-simple-select-helper-label">service</InputLabel>
    //             <Select

    //               labelId="demo-simple-select-helper-label"
    //               id="demo-simple-select-helper"
    //               value={cityName}
    //               onChange={handleChange}
    //               renderValue={(selectedCity) => `${selectedCity}`}
    //             >
    //               <MenuItem value="">
    //                 <em>None</em>
    //               </MenuItem>
    //               {cities.map((option) => (
    //                 <MenuItem value={option.id}>{option.name}</MenuItem>
    //               ))}
    //             </Select>
    //             {errors.city_id && (
    //               <FormHelperText sx={{ color: "#d32f2f" }}>
    //                 {errors.city_id}
    //               </FormHelperText>
    //             )}
    //           </FormControl>
    //           <FormControl sx={{ width: "100%"  , marginTop:"20px"}}>
    //             <InputLabel id="demo-simple-select-helper-label">doctors</InputLabel>
    //             <Select
    //               error={errors.city_id ? true : false}
    //               labelId="demo-simple-select-helper-label"
    //               id="demo-simple-select-helper"
    //               value={cityName}
    //               onChange={handleChange}
    //               renderValue={(selectedCity) => `${selectedCity}`}
    //             >
    //               <MenuItem value="">
    //                 <em>None</em>
    //               </MenuItem>
    //               {cities.map((option) => (
    //                 <MenuItem value={option.id}>{option.name}</MenuItem>
    //               ))}
    //             </Select>
    //             {errors.city_id && (
    //               <FormHelperText sx={{ color: "#d32f2f" }}>
    //                 {errors.city_id}
    //               </FormHelperText>
    //             )}
    //           </FormControl>
    //           <FormControl sx={{ width: "100%" , marginTop:"20px" }}>
    //             <InputLabel id="demo-simple-select-helper-label">date</InputLabel>
    //             <Select
    //               error={errors.city_id ? true : false}
    //               labelId="demo-simple-select-helper-label"
    //               id="demo-simple-select-helper"
    //               value={cityName}
    //               onChange={handleChange}
    //               renderValue={(selectedCity) => `${selectedCity}`}
    //             >
    //               <MenuItem value="">
    //                 <em>None</em>
    //               </MenuItem>
    //               {cities.map((option) => (
    //                 <MenuItem value={option.id}>{option.name}</MenuItem>
    //               ))}
    //             </Select>
    //             {errors.city_id && (
    //               <FormHelperText sx={{ color: "#d32f2f" }}>
    //                 {errors.city_id}
    //               </FormHelperText>
    //             )}
    //           </FormControl>

    //           <FormControl sx={{ width: "100%" , marginTop:"20px" }}>
    //             <InputLabel id="demo-simple-select-helper-label">start time</InputLabel>
    //             <Select
    //               error={errors.city_id ? true : false}
    //               labelId="demo-simple-select-helper-label"
    //               id="demo-simple-select-helper"
    //               value={cityName}
    //               onChange={handleChange}
    //               renderValue={(selectedCity) => `${selectedCity}`}
    //             >
    //               <MenuItem value="">
    //                 <em>None</em>
    //               </MenuItem>
    //               {cities.map((option) => (
    //                 <MenuItem value={option.id}>{option.name}</MenuItem>
    //               ))}
    //             </Select>
    //             {errors.city_id && (
    //               <FormHelperText sx={{ color: "#d32f2f" }}>
    //                 {errors.city_id}
    //               </FormHelperText>
    //             )}
    //           </FormControl>
    //           <FormControl sx={{ width: "100%" , marginTop:"20px" }}>
    //             <InputLabel id="demo-simple-select-helper-label">end time</InputLabel>
    //             <Select
    //               error={errors.city_id ? true : false}
    //               labelId="demo-simple-select-helper-label"
    //               id="demo-simple-select-helper"
    //               value={cityName}
    //               onChange={handleChange}
    //               renderValue={(selectedCity) => `${selectedCity}`}
    //             >
    //               <MenuItem value="">
    //                 <em>None</em>
    //               </MenuItem>
    //               {cities.map((option) => (
    //                 <MenuItem value={option.id}>{option.name}</MenuItem>
    //               ))}
    //             </Select>
    //             {errors.city_id && (
    //               <FormHelperText sx={{ color: "#d32f2f" }}>
    //                 {errors.city_id}
    //               </FormHelperText>
    //             )}
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={6} >

    //         <Box sx={{ height: "400px" }}>
    //           <div>

    //         <FullCalendar
    //           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    //           // headerToolbar={{
    //           //   left: "prev,next today",
    //           //   center: "title",
    //           //   right: "dayGridMonth,timeGridWeek,timeGridDay",
    //           // }}
    //           initialView="timeGridDay"
    //           editable={true}
    //           selectable={true}
    //           selectMirror={true}
    //           dayMaxEvents={true}
    //           weekends={weekendsVisible}
    //           // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed

    //         />
    //          </div>
    //          </Box>
    //         </Grid>

    //       </Grid>
    //     </Box>

    //           <Box sx={{ textAlign: "right" }}>
    //             <Button
    //               type="submit"
    //               sx={{ textTransform: "capitalize" }}
    //               variant="contained"
    //             >
    //               save
    //             </Button>
    //           </Box>
    //         </>
    //       </Box>
    //     </Box>
  );
};

export default AddBooking;

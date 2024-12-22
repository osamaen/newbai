import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, Stack, MenuItem, Autocomplete } from "@mui/material";
import Header from "../../components/Header";
import dayjs from "dayjs";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNationalitiesContext } from "../../context/NationalitiesContext";
import { useLeadSourcesContext } from "../../context/LeadSourcesContext";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  /* firefox */
  &:focus-visible {
    outline: 0;
  }
`
);
const AddCustomer = () => {
   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
   const [showErrorAlert, setShowErrorAlert] = useState(false);
   const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [nationalityId, setNationalityId] = useState(null);
  const [leadById, setLeadById] = useState(null);
  const [sourceOfLeadId, setSourceOfLeadId] = useState(null);
  const [note, setNote] = useState(null);
  const [genderId, setGenderId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [personalPhoto, setPersonalPhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [searchLoading, setSearchloading] = useState(false);
  const { nationalities, nationalitiesloading, nationalitiesError } =
    useNationalitiesContext();

  const handleleadSourceIdChange = (event) => {
    setSourceOfLeadId(event.target.value);
    console.log(sourceOfLeadId);
  };

  const {
    lead_sources,
    loading: leadSourcesLoading,
    error: leadSourcesError,
  } = useLeadSourcesContext();
  // Handlers for each photo field
  const handlePersonalPhotoChange = (e) => {
    const file = e.target.files[0];
    setPersonalPhoto(
      file ? { file, preview: URL.createObjectURL(file) } : null
    );
  };

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

  const handleClose = () => {
    setShowAlert(false);
  };

  const handleGenderChange = (event) => {
    setGenderId(event.target.value); // Update genderId state
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append(
        "date_of_birth",
        dateOfBirth && dayjs(dateOfBirth).isValid()
          ? dayjs(dateOfBirth).format("YYYY-MM-DD")
          : ""
      );
      formData.append("email", email);
      formData.append("nationality_id", nationalityId?.id);
      formData.append("phone_number", phoneNumber);
      formData.append("id_number", idNumber);
      formData.append("lead_source_id", sourceOfLeadId);
      formData.append("lead_by", leadById?.id);
      formData.append("note", note);

      if (idPhoto?.file) {
        formData.append("id_photo", idPhoto.file);
      }
      if (personalPhoto?.file) {
        formData.append("personal_photo", personalPhoto.file);
      }
      if (passportPhoto?.file) {
        formData.append("passport_photo", passportPhoto.file);
      }

      formData.append("gender_id", genderId);

      const response = await fetch("http://127.0.0.1:8000/api/customers", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: formData,
      });

      const content = await response.json();

      if (content.statusCode === 200) {
        setShowSuccessAlert(true); // عرض تنبيه النجاح
        setMessage(content.message); 
      } else {
        setErrors(content.errors); // إذا كانت هناك أخطاء
        setMessage(content.message); 
        setShowErrorAlert(true);

      }
    } catch (error) {
      console.log(error);
    }
  };
  const [photos, setPhotos] = useState([]);
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const previewFiles = selectedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setPhotos(previewFiles);
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/employees`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      });
      const data = await response.json();
      if (data.statusCode == 200) {
        setEmployees(data.data.employees[0]);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      // setApartmentLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Box>
      <Header title="CREATE CUSTOMERS" subTitle="Create a New Customer" />
      {showSuccessAlert && (
        <Alert severity="success" onClose={handleClose} sx={{ margin: "20px" }}>
          {message}
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={handleClose} sx={{ margin: "20px" }}>
          {message}
        </Alert>
      )}
      <Box
        onSubmit={handleSubmit}
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        noValidate
        autoComplete="off"
      >
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <TextField
            sx={{ flex: 1 }}
            label="first name"
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.first_name ? true : false}
            helperText={errors.first_name && errors.first_name}
          />
          <TextField
            sx={{ flex: 1 }}
            label="last name"
            onChange={(e) => setLastName(e.target.value)}
            error={errors.last_name ? true : false}
            helperText={errors.last_name}
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
              value={sourceOfLeadId}
              label="source of lead"
              onChange={handleleadSourceIdChange}
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
            getOptionLabel={(option) => `${option.full_name}`}
            // value={selectedEmployee}
            // onChange={(e, value) => setSelectedEmployee(value)}

            onChange={(e, value) => setLeadById(value)}
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
          {/* <TextField
            sx={{ flex: 1 }}
            label="id Number"
            onChange={(e) => setIdNumber(e.target.value)}
            error={errors.total_rooms ? true : false}
            helperText={errors.total_rooms}
          /> */}
        </Stack>
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <TextField
            sx={{ flex: 1 }}
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email ? true : false}
            helperText={errors.email}
          />
          <TextField
            sx={{ flex: 1 }}
            label="phone number"
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={errors.phone_number ? true : false}
            helperText={errors.phone_number}
          />
        </Stack>
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ flex: 1 }}
              label={"Date of Birth"}
              views={["year", "month", "day"]}
              onChange={(newValue) => setDateOfBirth(newValue)} // تعيين القيمة مباشرة هنا
            />
          </LocalizationProvider>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              error={errors.gender_id ? true : false}
              labelId="gender-select-label"
              id="gender-select"
              label="gender"
              value={genderId}
              name="gender_id"
              onChange={handleGenderChange} // Add the onChange handler
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
        <TextField
          sx={{ flex: 1 }}
          label="note"
          onChange={(e) => setNote(e.target.value)}
          error={errors.note ? true : false}
          helperText={errors.note}
        />

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
        {/* <Stack sx={{ gap: 2 }} direction="row">
          <input
            type="file"
            accept="image/*"
            onChange={handlePersonalPhotoChange}
            style={{ display: "none" }}
            id="personal-photo-input"
          />
          <label htmlFor="personal-photo-input">
            <Button variant="contained" component="span">
              Upload Personal Photo
            </Button>
          </label>
          {personalPhoto && (
            <img src={personalPhoto.preview} alt="Personal" width={150} />
          )}
        </Stack> */}

        {/* <Stack sx={{ gap: 2 }} direction="row">
          <input
            type="file"
            accept="image/*"
            onChange={handlePassportPhotoChange}
            style={{ display: "none" }}
            id="passport-photo-input"
          />
          <label htmlFor="passport-photo-input">
            <Button variant="contained" component="span">
              Upload Passport Photo
            </Button>
          </label>
          {passportPhoto && (
            <img src={passportPhoto.preview} alt="Passport" width={150} />
          )}
        </Stack>

        <Stack sx={{ gap: 2 }} direction="row">
          <input
            type="file"
            accept="image/*"
            onChange={handleIdPhotoChange}
            style={{ display: "none" }}
            id="id-photo-input"
          />
          <label htmlFor="id-photo-input">
            <Button variant="contained" component="span">
              Upload ID Photo
            </Button>
          </label>
          {idPhoto && <img src={idPhoto.preview} alt="ID" width={150} />}
        </Stack> */}

        <Box sx={{ textAlign: "right" }}>
          <Button
            type="submit"
            sx={{ textTransform: "capitalize" }}
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCustomer;

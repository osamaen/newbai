import React, { useState } from "react";
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
const AddCustomer = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [nationalityId, setNationalityId] = useState(null);
  const [genderId, setGenderId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [personalPhoto, setPersonalPhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const { nationalities, nationalitiesloading, nationalitiesError } =
    useNationalitiesContext();
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

      if (content.statusCode == 200) {
        setShowAlert(true);
      } else {
        setErrors(content.errors);
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
  return (
    <Box>
      <Header title="CREATE CUSTOMERS" subTitle="Create a New Custoemr" />
      {showAlert && (
        <Alert severity="success" onClose={handleClose} sx={{ margin: "20px" }}>
          saved successfull
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
            // error={errors.first_name ? true : false}
            // helperText={errors.first_name && errors.first_name}
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

          <TextField
            sx={{ flex: 1 }}
            label="id Number"
            onChange={(e) => setIdNumber(e.target.value)}
            error={errors.total_rooms ? true : false}
            helperText={errors.total_rooms}
          />
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

        <Stack sx={{ gap: 2 }} direction="row">
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
        </Stack>

        <Stack sx={{ gap: 2 }} direction="row">
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
        </Stack>

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

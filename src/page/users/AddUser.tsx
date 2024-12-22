import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, Stack } from "@mui/material";
import Header from "../../components/Header";

const AddUser = () => {

  const [errors, setErrors] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [idPhoto, setIdPhoto] = useState(null);
  const [idNumber, setIdNumber] = useState("");
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [personalPhoto, setPersonalPhoto] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showAlert, setShowAlert] = useState(false); 

  useEffect(() => {
    // Fetch any necessary data here, if needed
  }, []);

  const handleClose = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("user_name", userName);
      formData.append("email", email);
      formData.append("id_photo", idPhoto);
      formData.append("id_number", idNumber);
      formData.append("passport_photo", passportPhoto);
      formData.append("personal_photo", personalPhoto);
      formData.append("phone_number", phoneNumber);
      formData.append("hire_date", hireDate);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('user_token')}`,
        },
        body: formData,
      });

      const content = await response.json();

      if(content.statusCode === 201) {
        setShowAlert(true);
        setErrors({});
      } else {
        setErrors(content.errors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Header title="CREATE EMPLOYEE" subTitle="Create a New Employee" />
      {showAlert && (
        <Alert severity="success" onClose={handleClose} sx={{ margin: '20px' }}>
          Employee added successfully
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
        <Stack sx={{ gap: 2 }} direction="row">
          <TextField
            sx={{ flex: 1 }}
            label="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.first_name ? true : false}
            helperText={errors.first_name && errors.first_name}
          />
          <TextField
            sx={{ flex: 1 }}
            label="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            error={errors.last_name ? true : false}
            helperText={errors.last_name && errors.last_name}
          />
        </Stack>
        <Stack sx={{ gap: 2 }} direction="row">
          <TextField
            sx={{ flex: 1 }}
            label="User Name"
            onChange={(e) => setUserName(e.target.value)}
            error={errors.user_name ? true : false}
            helperText={errors.user_name && errors.user_name}
          />
          <TextField
            sx={{ flex: 1 }}
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email ? true : false}
            helperText={errors.email && errors.email}
          />
        </Stack>
        <Stack sx={{ gap: 2 }} direction="row">
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            sx={{ flex: 1 }}
            label="ID Photo"
            onChange={(e) => setIdPhoto(e.target.files[0])}
            error={errors.id_photo ? true : false}
            helperText={errors.id_photo && errors.id_photo}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            sx={{ flex: 1 }}
            label="ID Number"
            onChange={(e) => setIdNumber(e.target.value)}
            error={errors.id_number ? true : false}
            helperText={errors.id_number && errors.id_number}
          />
        </Stack>
        <Stack sx={{ gap: 2 }} direction="row">
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            sx={{ flex: 1 }}
            label="Passport Photo"
            onChange={(e) => setPassportPhoto(e.target.files[0])}
            error={errors.passport_photo ? true : false}
            helperText={errors.passport_photo && errors.passport_photo}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            sx={{ flex: 1 }}
            label="Personal Photo"
            onChange={(e) => setPersonalPhoto(e.target.files[0])}
            error={errors.personal_photo ? true : false}
            helperText={errors.personal_photo && errors.personal_photo}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>
        <Stack sx={{ gap: 2 }} direction="row">
          <TextField
            sx={{ flex: 1 }}
            label="Phone Number"
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={errors.phone_number ? true : false}
            helperText={errors.phone_number && errors.phone_number}
          />
          <TextField
            type="date"
            label="Hire Date"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
            onChange={(e) => setHireDate(e.target.value)}
            error={errors.hire_date ? true : false}
            helperText={errors.hire_date && errors.hire_date}
          />
        </Stack>
        <Stack sx={{ gap: 2 }} direction="row">
          <TextField
            type="password"
            sx={{ flex: 1 }}
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password ? true : false}
            helperText={errors.password && errors.password}
          />
          <TextField
            type="password"
            sx={{ flex: 1 }}
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword && errors.confirmPassword}
          />
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

export default AddUser;

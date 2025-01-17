
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import { Alert, Button, MenuItem, Snackbar, Stack } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Header from "../../components/Header";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';



const EditBooking  = () => {



  const { id } = useParams(); // Get the doctorId from the URL

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [cityName, setSelectedCityName] = useState("");


  
  const handleChange = (event) => {
    // setCityId(event.target.value);
    const selectedCity = cities.find(city => city.id === event.target.value);
    // setSelectedCityName(selectedCity ? selectedCity.name : '');
    selectedCity ? setDoctorData( values   => 
      ({ ...doctorData , city_id  : event.target.value })): '' ;
    

  };

  const handleChangeforall = (event) => {

    const name = event.target.name;
    const value = event.target.value;

    // setDoctorData({ ...doctorData ,name: event.target.value });
    setDoctorData(values => ({...values, [name]: value}))
    console.log(doctorData);
  };



  useEffect(() => {
    // Fetch doctor data based on the doctorId
    const fetchDoctorData = async () => {
      try {
        
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`, {
          headers: {

            'Accept': 'application/json',
            'Content-Type': 'application/json', 
          
          },
        }); // Replace with your API endpoint
        const data = await response.json();
        setDoctorData(data.data.doctor);
      } catch (error) {
        console.error('Error fetching doctor data:');
      }
    };

    fetchDoctorData();
  }, [id]);



  const [showAlert, setShowAlert] = useState(false); 


  const handleClose = () => {
    setShowAlert(false);
  };




  const onSubmit = async (data) => {
    try {

    
      const response = await fetch(`http://127.0.0.1:8000/api/buildings/${id}`, {
        method: 'PUT', // Assuming you are updating the doctor data
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        console.log('Doctor data updated successfully');
      
      } else {
        console.error('Failed to update doctor data');
      }
    } catch (error) {
      console.error('Error updating doctor data:', error);
    }


  };

  return (



<Box>
    
  
    <Header title="Edit DOCTOR" subTitle="Edit Doctor" />
    {showAlert && (
      <Alert  severity="success" onClose={handleClose}  sx={{ margin: '20px' }} >
          saved successfull
      </Alert>
    )}
    <Box
      onSubmit={onSubmit}
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}

      autoComplete="off"
    >
      <Stack sx={{ gap: 2 }} direction={"row"}>
        <TextField
          sx={{ flex: 1 }}
          label="First Name"
          name="first_name"
          value={doctorData.first_name}
          onChange={handleChangeforall}
          error={errors.first_name ? true : false}
          helperText={errors.first_name && errors.first_name}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          sx={{ flex: 1 }}
          label="Last Name"
          name="last_name"
          value={doctorData.last_name}
          onChange={handleChangeforall}
          error={errors.last_name ? true : false}
          helperText={errors.last_name}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>
      <Stack sx={{ gap: 2 }} direction={"row"}>
        <TextField
    
          sx={{ flex: 1 }}
          label="Address"
          name="address"
          value={doctorData.address}
          onChange={handleChangeforall}
          error={errors.address ? true : false}
          helperText={errors.address}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
        error={errors.date_of_birth ? true : false}
        helperText={errors.date_of_birth}
        value={doctorData.date_of_birth}
          type="date"
          name="date_of_birth"
          sx={{ flex: 1 }}
          label="Date OF Birth"
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>
      <Stack sx={{ gap: 2 }} direction={"row"}>
      <TextField
        sx={{ flex: 1 }}
        name="specialty"
        value={doctorData.date_of_birth}
        error={errors.specialty ? true : false}
        helperText={errors.specialty}
        label="specialty"
        onChange={(e) => setSpecialty(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        sx={{ flex: 1 }}
        name="phone_number"
        error={errors.phone_number ? true : false}
        helperText={errors.phone_number}
        onChange={(e) => setPhoneNumber(e.target.value)}
        label="Phone Number"

      />
  </Stack>
  <Stack sx={{ gap: 2 }} direction={"row"}>
<FormControl   sx={{ flex: 1 }}>
    <InputLabel id="demo-simple-select-helper-label">city</InputLabel>
      <Select
        error={errors.city_id ? true : false}
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={cityName}
        name="city_id"
        onChange={handleChange}
        renderValue={(selectedCity) => `${selectedCity}`}
      >
<MenuItem value="">
          <em>None</em>
        </MenuItem>
        {cities.map((option) => (
          <MenuItem value={option.id} >
            {option.name}
          </MenuItem>
        ))}






        
      </Select>
     {errors.city_id && <FormHelperText sx={{ color: '#d32f2f' }}>{errors.city_id}</FormHelperText>} 
      </FormControl>

      <FormControl   sx={{ flex: 1 }}>
    <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
    <RadioGroup
      row
      aria-labelledby="demo-row-radio-buttons-group-label"
      name="gender"
      onChange={handleChangeforall}
  
     
    >
      <FormControlLabel value="male" control={<Radio />} label="Male" /> 
      <FormControlLabel value="female" control={<Radio />} label="Female" />
      <FormHelperText sx={{ color: '#d32f2f' }}>{errors.gender}</FormHelperText>
    </RadioGroup>
  </FormControl>



      </Stack>



      <Box sx={{ textAlign: "right" }}>
        <Button
          type="submit"
          sx={{ textTransform: "capitalize" }}
          variant="contained"
        >
          Create New Doctor
        </Button>

   
      </Box>
    </Box>


</Box>

);

}

export default EditBooking;

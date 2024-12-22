import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, MenuItem, Stack } from "@mui/material";
import Header from "../../components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { useBuildingsContext } from '../../context/BuildingsContext';

const AddApartment = () => {


  const [errors, setErrors] = useState({});
  const { buildings, loading, error } = useBuildingsContext();
  const [name, setName] = useState("");
  const [building_id, setBuildingId] = useState("");
  const [floor_number, setFloorNumber] = useState("");
  const [total_rooms, setTotalRooms] = useState("");

  const [showAlert, setShowAlert] = useState(false); 


 
  const handleClose = () => {
    setShowAlert(false);
  };



  const [buildingName, setSelectedBuildingName] = useState("");

  const handleChange = (event) => {
    setBuildingId(event.target.value);
    const selectedBuilding = buildings.find(building => building.id === event.target.value);
    setSelectedBuildingName(selectedBuilding ? selectedBuilding.name : '');
 

  };

  const handleSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/apartments", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('user_token')}`,
        },
        body: JSON.stringify({
          name: name,
          building_id: building_id,
          floor_number: floor_number,
          total_rooms: total_rooms,
        }),
      });
  
       const content = await response.json();
      //  console.log(content.errors);
      if(content.statusCode == 200){
        // يمكنك هنا إجراء أي إجراءات تريدها بعد الاستجابة الناجحة من الخادم.
        setShowAlert(true);
      }else {
      
        // console.log(content.errors);
          setErrors(content.errors);
          // setShowAlert(true); 
        } 
    } catch (error) {
      console.log(error);
    }
  };

  // const handleGenderChange = (event) => {
  //   setGender(event.target.value);
  // };

  return (

<Box>
    
  
      <Header title="CREATE APARTMENTS" subTitle="Create a New Apartment" />
      {showAlert && (
        <Alert  severity="success" onClose={handleClose}  sx={{ margin: '20px' }} >
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
<FormControl   sx={{ flex: 1 }}>
    <InputLabel id="demo-simple-select-helper-label">Building</InputLabel>
      <Select
        error={errors.city_id ? true : false}
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={buildingName}
        name="building_id"
        onChange={handleChange}
        renderValue={(selectedBuilding) => `${selectedBuilding}`}
      >
<MenuItem value="">
          <em>None</em>
        </MenuItem>
        {buildings.map((option) => (
          <MenuItem value={option.id} >
            {option.name}
          </MenuItem>
        ))}






        
      </Select>
     {errors.building_id && <FormHelperText sx={{ color: '#d32f2f' }}>{errors.building_id}</FormHelperText>} 
      </FormControl>

          <TextField
            sx={{ flex: 1 }}
            label="Name"
            onChange={(e) => setName(e.target.value)}
            error={errors.name ? true : false}
            helperText={errors.name && errors.name}
          />
  
  
        </Stack>
        <Stack sx={{ gap: 2 }} direction={"row"}>
        <TextField
      
      sx={{ flex: 1 }}
      label="Floor Number"
      onChange={(e) => setFloorNumber(e.target.value)}
      error={errors.floor_number ? true : false}
      helperText={errors.floor_number}
    />
          <TextField
      
            sx={{ flex: 1 }}
            label="Total Rooms"
            onChange={(e) => setTotalRooms(e.target.value)}
            error={errors.total_rooms ? true : false}
            helperText={errors.total_rooms}
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

}


export default AddApartment ; 

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, Stack } from "@mui/material";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";

const EditBuilding = () => {
  const location = useLocation();
  const building = location.state;

  const [errors, setErrors] = useState({});

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [locationDetails, setLocationDetails] = useState("");

  const [showAlert, setShowAlert] = useState(false); 


  useEffect(() => {
    if (building) {
      setName(building.name || "");
      setAddress(building.address || "");
      setLocationDetails(building.location_details || "");
    }
  }, [building]);

  const handleClose = () => {
    setShowAlert(false);
  };





  const handleSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/buildings/${building.id}`, {
        method: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('user_token')}`,
        },
        body: JSON.stringify({
          name: name,
          location_details: locationDetails,
          address: address,
    
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

  return (

<Box>
    
  
      <Header title="EDIT BUILDING" subTitle="Edit Building Information" />
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
          <TextField
            sx={{ flex: 1 }}
            value={name}
            label="Name"
            onChange={(e) => setName(e.target.value)}
            error={errors.name ? true : false}
            helperText={errors.name && errors.name}
            InputLabelProps={{
              shrink: true,
            }}
          />
  
  <TextField
      
      sx={{ flex: 1 }}
      label="Address"
      value={address} // استخدام القيمة القديمة
      onChange={(e) => setAddress(e.target.value)}
      error={errors.address ? true : false}
      helperText={errors.address}
      InputLabelProps={{
        shrink: true,
      }}
    />
        </Stack>
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <TextField
         value={locationDetails}
            sx={{ flex: 1 }}
            label="Location Details"
            onChange={(e) => setLocationDetails(e.target.value)}
            error={errors.location_details ? true : false}
            helperText={errors.location_details}
            InputLabelProps={{
              shrink: true,
            }}
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


export default EditBuilding ; 

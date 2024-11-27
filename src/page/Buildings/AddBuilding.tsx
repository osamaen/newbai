import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, Stack } from "@mui/material";
import Header from "../../components/Header";


const AddBuilding = () => {


  const [errors, setErrors] = useState({});

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [locationDetails, setLocationDetails] = useState("");

  const [showAlert, setShowAlert] = useState(false); 


  useEffect(() => {
  
    // fetch("http://127.0.0.1:8000/api/cities", {
    //   headers: {
    //     "Accept": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem('user_token')}`,
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    
    //     setCities(data.data.cities[0]);
    //   })
    //   .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleClose = () => {
    setShowAlert(false);
  };






  const handleSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/buildings", {
        method: "POST",
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

  // const handleGenderChange = (event) => {
  //   setGender(event.target.value);
  // };

  return (

<Box>
    
  
      <Header title="CREATE BUILDING" subTitle="Create a New Building" />
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
            label="Name"
            onChange={(e) => setName(e.target.value)}
            error={errors.name ? true : false}
            helperText={errors.name && errors.name}
          />
  
  <TextField
      
      sx={{ flex: 1 }}
      label="Address"
      onChange={(e) => setAddress(e.target.value)}
      error={errors.address ? true : false}
      helperText={errors.address}
    />
        </Stack>
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <TextField
      
            sx={{ flex: 1 }}
            label="Location Details"
            onChange={(e) => setLocationDetails(e.target.value)}
            error={errors.location_details ? true : false}
            helperText={errors.location_details}
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


export default AddBuilding ; 

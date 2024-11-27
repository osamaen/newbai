import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Header from "../../components/Header";
import Backdrop from '@mui/material/Backdrop';


const Buildings = () => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleEdit = (doctorId) => {
    // Navigate to the edit page based on the doctor ID
    // console.log(`Navigate to edit doctor page with ID: ${doctorId}`);
    navigate(`/buildings/${doctorId}/edit`);
  };

  const handleDelete = (doctorId) => {
    // Open the delete confirmation modal and set the selected doctor
    handleOpen();
    setSelectedDoctor(doctorId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    // Perform the actual delete operation and close the modal
    console.log(`Delete doctor with ID: ${selectedDoctor}`);
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteCancelled = () => {
    // Close the delete confirmation modal without performing the delete operation
    setDeleteConfirmationOpen(false);
  };




  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/buildings", {
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBuildings(data.data.buildings[0]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "name",
      headerName: "name",
      width: 60,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    { field: "address",
       headerName: "address", 
       width: 60,
       flex: 1,
       align: "center", 
       headerAlign: "center" 
      },
    { field: "location_details",
       headerName: "location_details", 
       width: 60,
       flex: 1,
       align: "center", 
       headerAlign: "center" 
      },
 
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="outlined" color="primary" sx={{ margin:1 }} onClick={() => handleEdit(params.row.id)}>
            Edit
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Header
              isDashboard={true}
              title={"OUR BUILDINGS"}
              subTitle={"Welcome to your dashboard"}
            />
            <Box sx={{ textAlign: "right", mb: 1.3 }}>
              <Button
                sx={{ padding: "6px 8px",textTransform: "capitalize" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate('/doctors/add');
                }}
              >Add Building</Button>
            </Box>
      </Stack>
     
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid
        slots={{
          toolbar: GridToolbar,
        }}
          rows={buildings}
          // @ts-ignore
          columns={columns}
          // getRowId={(row) => row.id}
        />
      </Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
            Are you sure you want to delete the doctor?
            </Typography>
         

            <>
          <Button variant="outlined" color="success" sx={{ margin:1 }}>
        yes
          </Button>
          <Button variant="outlined" color="secondary" >
            no
          </Button>
        </>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Buildings;

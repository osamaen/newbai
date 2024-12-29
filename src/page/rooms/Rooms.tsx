import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Header from "../../components/Header";
import Backdrop from '@mui/material/Backdrop';


const Rooms = () => {

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
  // field ==> Reqird
  const [rooms, setRooms] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // const handleViewBedSpaces = (roomId) => {
  //   // Navigate to the edit page based on the doctor ID
  //   // console.log(`Navigate to edit doctor page with ID: ${doctorId}`);
  //   navigate(`rooms/${roomId}/bedspaces`);
  // };

  const handleDelete = (roomId) => {
    // Open the delete confirmation modal and set the selected doctor
    handleOpen();
    setSelectedDoctor(roomId);
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

  const handleBedSpaceClick = (roomId) => {
    navigate(`/rooms/${roomId}/bedspaces`);
  };

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/rooms", {
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // // Add a unique ID to each row using uuid
        // const doctorsWithIds = data.data.doctors[0].map((doctor) => ({
        //   ...doctor,
        //   id: uuidv4(),
        // }));
        setRooms(data.data.rooms[0]);
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
      flex: 1,
      headerName: "Name",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "room_types",
      flex: 1,
      headerName: "Room Types",
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.room_type?.name || "N/A",
    },
    { field: "apartment",
      flex: 1,
       headerName: "Apartment", 
       align: "center", 
       headerAlign: "center" ,
       valueGetter: (params) => {
        const buildingName = params.row.apartment?.building_name || "N/A";
        const apartmentName = params.row.apartment?.name || "N/A";
        return `${buildingName} / ${apartmentName}`;
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
         {params.row.room_type?.id === 3 && (  // Assuming 3 is the "Bed Space" room type ID
        <Button
          variant="outlined"
          sx={{ margin: 1 }}
          onClick={() => handleBedSpaceClick(params.row.id)}
        >
          View Bed Spaces
        </Button>
      )}
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
              title={"OUR ROOMS"}
              subTitle={"Welcome to your dashboard"}
            />
            <Box sx={{ textAlign: "right", mb: 1.3 }}>
              <Button
                sx={{ padding: "6px 8px",textTransform: "capitalize" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate('/room/add');
                }}
              >Add new room</Button>
            </Box>
      </Stack>
     
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid
        slots={{
          toolbar: GridToolbar,
        }}
          rows={rooms}
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

export default Rooms;

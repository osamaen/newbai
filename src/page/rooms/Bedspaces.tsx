import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Header from "../../components/Header";
import Backdrop from '@mui/material/Backdrop';
import { useParams } from 'react-router-dom';

const Bedspaces = () => {

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
  const [bedSpaces, setBedSpaces] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { id } = useParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleEdit = (roomId) => {
    // Navigate to the edit page based on the doctor ID
    // console.log(`Navigate to edit doctor page with ID: ${doctorId}`);
    navigate(`rooms/${roomId}/bedspaces`);
  };

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

 
  useEffect(() => {
    if (id) {
      fetchBedSpaces(id); // Fetch bed spaces when the component is mounted
    }
  }, [id]);

  // Fetch bed spaces from your API
  const fetchBedSpaces = async (roomId) => {
    try {
      const response = await   fetch(`http://127.0.0.1:8000/api/rooms/${roomId}/bedspaces`, {
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${localStorage.getItem('user_token')}`,
        },
      });
      const data = await response.json();
      setBedSpaces(data.data.bed_spaces[0]); // Assuming data is nested like in your example
    } catch (error) {
      console.error("Error fetching bed spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Room Name",
      flex: 1,
      headerName: "Room Name",
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.room?.name || "N/A",
    },
    {
      field: "bed_number",
      flex: 1,
      headerName: "Bed Number",
      align: "center",
      headerAlign: "center",
     
    },
    {
      field: "position_description",
      flex: 1,
      headerName: "Position Description",
      align: "center",
      headerAlign: "center",

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
              title={`Bed spaces for room ${id} `}
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
              >Add new bed</Button>
            </Box>
      </Stack>
     
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid
        slots={{
          toolbar: GridToolbar,
        }}
          rows={bedSpaces}
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

export default Bedspaces;

import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Header from "../../components/Header";
import Backdrop from '@mui/material/Backdrop';
import { styled, alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Customers = () => {

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
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const handleView = (customer) => {
    // Set the selected customer for details view
    setSelectedCustomer(customer);
  
    // رابط الأساس للحصول على الصور
    const imageUrlBase = 'http://localhost:8000/image/';
  

    // console.log(`${imageUrlBase}${customer.passport_photo}`);
    setSelectedCustomer((prevCustomer) => ({
      ...prevCustomer,
      idPhotoUrl: `${imageUrlBase}${customer.id_photo}`,
      passportPhotoUrl: `${imageUrlBase}${customer.passport_photo}`,
      personalPhotoUrl: `${imageUrlBase}${customer.personal_photo}`,

    }));
  
    // عرض النافذة (المودال)
    setShowDetailsModal(true);
  };


  const handleEdit = (doctorId) => {
    // Navigate to the edit page based on the doctor ID
    // console.log(`Navigate to edit doctor page with ID: ${doctorId}`);
    navigate(`/customer/${doctorId}/edit`);
  };

  const handleDelete = (doctorId) => {
    // Open the delete confirmation modal and set the selected doctor
    handleOpen();
    setSelectedDoctor(doctorId);
    setDeleteConfirmationOpen(true);
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
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
    fetch("http://127.0.0.1:8000/api/customers", {
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data.data.customers[0]);
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
      field: "full_name",
      headerName: "Full Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nationality",
      headerName: "nationality",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.nationality.name || "N/A",
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
         <Button variant="outlined" color="primary" sx={{ margin:1 }} onClick={() => handleView(params.row)}>
            view
          </Button>
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
              title={"OUR CUSTOMERS"}
              subTitle={"Welcome to your dashboard"}
            />
            <Box sx={{ textAlign: "right", mb: 1.3 }}>
              <Button
                sx={{ padding: "6px 8px",textTransform: "capitalize" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate('/customers/add');
                }}
              >Add new Customer</Button>
            </Box>
      </Stack>
     
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid
        slots={{
          toolbar: GridToolbar,
        }}
          rows={customers}
          // @ts-ignore
          columns={columns}
          // getRowId={(row) => row.id}
        />
      </Box>
      
      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
  <Box sx={{ width: 1200, backgroundColor: "white", padding: 3, margin: "auto", marginTop: 10 }}>
  <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Reservation Details">
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        First name
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.first_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        last Name
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.last_name || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Phone number
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.phone_number || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        gender
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.gender?.name || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Nationality
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.nationality?.name ||
                          "N/A"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        email
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.email || "N/A"}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                      Source of lead
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.lead_source.name || "N/A"}
                      </StyledTableCell>

                      <StyledTableCell sx={{ fontWeight: 650 }}>
                       Lead by
                      </StyledTableCell>
                      <StyledTableCell>
                      {selectedCustomer?.lead_by.full_name || "N/A"}
                      </StyledTableCell>

                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Note
                      </StyledTableCell>
                      <StyledTableCell>
                        {selectedCustomer?.note || "N/A"}
                      </StyledTableCell>

                    

                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Id photo
                      </StyledTableCell>
                      <StyledTableCell>
                        <img
                          width={200}
                          src={`http://localhost:8000/image/${selectedCustomer?.id_photo}`}
                          alt="ID Photo"
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 650 }}>
                        Passport photo
                      </StyledTableCell>
                      <StyledTableCell>
                  
                        <img
                          width={200}
                          src={`http://localhost:8000/image/${selectedCustomer?.passport_photo}`}
                          alt="ID Photo"
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
    
    
    
    
    
    

    <Button sx={{ marginTop: 2 }} variant="contained" onClick={() => setShowDetailsModal(false)}>
      Close
    </Button>
  </Box>
</Modal>

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
            Are you sure you want to delete the customer?
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

export default Customers;

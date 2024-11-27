import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack} from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header";

const Bookings = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);


  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/bookings", {
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      },
    })
      // .then((response) => response.json())
      .then((data) => {
        setBookings(data.data.bookings[0]);
      })
      .catch((error) =>
         console.error("Error fetching data:", error));
  }, []);






  // field ==> Reqird
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "city",
      headerName: "city",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "clinic",
      headerName: "clinic",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
       field: "service",
       headerName: "service",
        align: "center", 
        headerAlign: "center" 
      },
    {
      field: "doctor",
      headerName: "doctor",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
   
    {
      field: "start_time",
      headerName: "Start Time",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "end_time",
      headerName: "End Time",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },  {
      field: "booking_date",
      headerName: "Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            sx={{
              p: "5px",
              width: "99px",
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",

              backgroundColor:
              status === "Admin"
                  ? theme.palette.primary.dark
                  : status === "Manager"
                  ? theme.palette.secondary.dark
                  : "#3da58a",
            }}
          >
           

            

            <Typography sx={{ fontSize: "13px", color: "#fff" }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "actions",
      flex: 1,
      align: "center",
      headerAlign: "center",
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
              title={"BOOKINGS"}
              subTitle={"Welcome to your dashboard"}
            />
            <Box sx={{ textAlign: "right", mb: 1.3 }}>
              <Button
                sx={{ padding: "6px 8px",textTransform: "capitalize" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate('/bookings/add');
                }}
              >Add Booking</Button>
            </Box>
      </Stack>
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid

slots={{
  toolbar: GridToolbar,
}}

          rows={bookings}
          // @ts-ignore
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Bookings;

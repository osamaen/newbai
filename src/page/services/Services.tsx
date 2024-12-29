import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";
import { Box, Typography, Stack} from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header";






const Services = () => {
  const theme = useTheme();

  const [services, setServices] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/services", {
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setServices(data.data.services[0]);
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
      field: "city",
      headerName: "City",
      align: "center",
      headerAlign: "center",
    },{
      field: "title",
      headerName: "title",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    { field: "clinic",
       headerName: "clinic", 
       align: "center", 
       headerAlign: "center" 
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
              status === "Enable"
                  ? theme.palette.success.dark
                  : status === "Disable"
                  ? theme.palette.error.dark
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
  
        <Header title="SERVICES" subTitle="List of Invoice Balances" />
  
  
        <Box sx={{ height: 650,   mx: "auto" }}>
        <DataGrid
          checkboxSelection
          slots={{
            toolbar: GridToolbar,
          }}
          rows={services}
          columns={columns}
        />
      </Box>
  
  
  
</Box>

  );
};

export default Services;

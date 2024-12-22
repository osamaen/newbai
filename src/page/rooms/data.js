
const bedSpacesColumns = [
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
    flex: 1,
    width: 400,
    renderCell: (params) => (
      <>
        <Button
          variant="outlined"
          sx={{ margin: 1 }}
          onClick={() => handleBedSpaceClick(params.row.id)}
        >
          Add Reservation
        </Button>
      </>
    ),
  },
];
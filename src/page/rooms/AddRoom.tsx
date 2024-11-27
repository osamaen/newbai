import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Alert,
  Button,
  Autocomplete,
  Stack,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import Header from "../../components/Header";
import { useBuildingsContext } from "../../context/BuildingsContext";
import { useRoomTypesContext } from "../../context/RoomTypesContext";


// Custom reusable form components
const CheckboxField = ({ label, checked, onChange }) => (
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={onChange} />}
    label={label}
  />
);

const AddRoom = () => {
  const [errors, setErrors] = useState({});
  const {
    buildings,
    loading: buildingLoading,
    error: buildingError,
  } = useBuildingsContext();
  const {
    room_types,
    loading: roomTypeLoading,
    error: roomTypeError,
  } = useRoomTypesContext();
  const [bedCount, setBedCount] = useState(""); // عدد الأسرة
  const [bedDetails, setBedDetails] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [apartments, setApartments] = useState([]);
  const [apartmentLoading, setApartmentLoading] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasBathroom, setHasBathroom] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleRemoveBed = (index) => {
    setBedDetails((prev) => prev.filter((_, i) => i !== index));
  };
  const handleBedChange = (index, field, value) => {
    setBedDetails((prev) => {
      const updatedBeds = [...prev];
      updatedBeds[index][field] = value;
      return updatedBeds;
    });
  };

  useEffect(() => {
    if (selectedBuilding) {
      fetchApartments(selectedBuilding.id);
    } else {
      setApartments([]);
    }
  }, [selectedBuilding]);

  const fetchApartments = async (buildingId) => {
    setApartmentLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/buildings/${buildingId}/apartments`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch apartments");
      const data = await response.json();
      const extractedApartments = data.data.apartments.flat();
      setApartments(extractedApartments);
    } catch (err) {
      console.error(err.message);
    } finally {
      setApartmentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate input
    if (!name || !selectedRoomType || !selectedApartment) {
      setErrors({
        name: !name ? "Room name is required" : null,
        selectedRoomType: !selectedRoomType ? "Room type is required" : null,
        selectedApartment: !selectedApartment ? "Apartment is required" : null,
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/rooms", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify({
          name,
        apartment_id: selectedApartment.id,
        room_type_id: selectedRoomType.id,
        has_bathroom: hasBathroom,
        has_balcony: hasBalcony,
        price,
        bed_spaces: bedDetails, 
        }),
      });

      const content = await response.json();
      if (content.statusCode === 200) {
        setShowAlert(true);
        setName("");
        setPrice("");
        setSelectedRoomType(null);
        setSelectedApartment(null);
        setSelectedBuilding(null);
        setHasBalcony(false);
        setHasBathroom(false);
      } else {
        setErrors(content.errors || {});
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleBedDetailsChange = (index, field, value) => {
    setBedDetails((prev) => {
      const updatedBeds = [...prev];
      updatedBeds[index][field] = value;
      return updatedBeds;
    });
  };

  const handleAddBed = () => {
    setBedDetails((prev) => [
      ...prev,
      { bed_number: "", position_description: "", price: "" },
    ]);
  };

  return (
    <Box>
      <Header title="CREATE NEW ROOM" subTitle="Create a New Room" />
      {showAlert && (
        <Alert
          severity="success"
          onClose={() => setShowAlert(false)}
          sx={{ margin: "20px" }}
        >
          Room saved successfully!
        </Alert>
      )}

      <Box
        onSubmit={handleSubmit}
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        noValidate
        autoComplete="off"
      >
        {/* Select Building & Apartment */}
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <Autocomplete
            sx={{ flex: 1 }}
            options={buildings}
            getOptionLabel={(option) => option.name}
            value={selectedBuilding}
            onChange={(e, value) => setSelectedBuilding(value)}
            renderInput={(params) => (
              <TextField {...params} label="Choose Building" />
            )}
          />

          <Autocomplete
            sx={{ flex: 1 }}
            options={apartments}
            getOptionLabel={(option) => option.name}
            value={selectedApartment}
            onChange={(e, value) => setSelectedApartment(value)}
            loading={apartmentLoading}
            renderInput={(params) => (
              <TextField {...params} label="Choose Apartment" />
            )}
          />
        </Stack>

     

        {/* Room Name & Type */}
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <Autocomplete
            sx={{ flex: 1 }}
            options={room_types}
            getOptionLabel={(option) => option.name}
            value={selectedRoomType}
            onChange={(e, value) => setSelectedRoomType(value)}
            renderInput={(params) => (
              <TextField {...params} label="Choose Room Type" />
            )}
          />

          <TextField
            sx={{ flex: 1 }}
            label="Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Stack>
        {selectedRoomType?.id === 3 && (
          <Stack sx={{ gap: 2 }} direction={"row"}>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddBed}
                sx={{ marginBottom: "10px" }}
              >
                + Add Bed
              </Button>

              {bedDetails.map((bed, index) => (
                <Stack
                  key={index}
                  direction="row"
                  sx={{ marginBottom: "10px" }} 
                  spacing={2}
                  alignItems="center"
                >
                  <TextField
                    label={`Bed ${index + 1} Number`}
                    value={bed.bed_number}
                    onChange={(e) =>
                      handleBedChange(index, "bed_number", e.target.value)
                    }
                  />
                  <TextField
                    label="Position Description"
                    value={bed.position_description}
                    onChange={(e) =>
                      handleBedChange(
                        index,
                        "position_description",
                        e.target.value
                      )
                    }
                  />
                  <TextField
                    label="Price"
                    type="number"
                    value={bed.price}
                    onChange={(e) =>
                      handleBedChange(index, "price", e.target.value)
                    }
                  />
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleRemoveBed(index)}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
            </Box>
          </Stack>
        )}
        {/* Price & Features */}
        <Stack sx={{ gap: 2 }} direction={"row"}>
        {selectedRoomType?.id !== 3 && (
  <TextField
    sx={{ flex: 1 }}
    label="Price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    error={!!errors.price}
    helperText={errors.price}
  />
)}
          <FormGroup sx={{ flex: 1 }}>
            <CheckboxField
              label="Has Balcony"
              checked={hasBalcony}
              onChange={(e) => setHasBalcony(e.target.checked)}
            />
            <CheckboxField
              label="Has Bathroom"
              checked={hasBathroom}
              onChange={(e) => setHasBathroom(e.target.checked)}
            />
          </FormGroup>
        </Stack>

        {/* Submit Button */}
        <Box sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddRoom;

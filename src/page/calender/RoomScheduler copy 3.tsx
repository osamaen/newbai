import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { ChevronLeft, ChevronRight, CalendarToday, WidthFull } from "@mui/icons-material";

const RoomScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [language, setLanguage] = useState("en"); // تحديد اللغة الافتراضية
  const [roomsData, setRoomsData] = useState([]);

  const fetchRoomsAndReservation = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/rooms-schedular`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );

      const data = await response.json();

      // if (data.statusCode === 200) {
        setRoomsData(data);
        // console.log(roomsData);
        
        // حفظ البيانات القادمة من الـ API
      // } else {
      //   console.error("Error fetching reservations:", data.message);
      // }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchRoomsAndReservation();
  }, []);

  const translations = {
    ar: {
      title: "جدول حجوزات الغرف",
      currentMonth: "العودة للشهر الحالي",
      available: "متاح",
      booked: "محجوز",
      room: "الغرفة",
      direction: "rtl",
    },
    en: {
      title: "Room Scheduler",
      currentMonth: "Go to Current Month",
      available: "Available",
      booked: "Booked",
      room: "Room",
      direction: "ltr",
    },
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const dates = getDaysInMonth(currentDate);

  const goToPreviousMonth = () =>
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  const goToNextMonth = () =>
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  const goToCurrentMonth = () => setCurrentDate(new Date());

  const formatDate = (date) =>
    date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      weekday: "short",
      day: "numeric",
    });
  const formatMonthYear = (date) =>
    date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
    });

    const getBookingInfo = (reservations, date) => {
      if (!reservations || reservations.length === 0) {
          return null; // التعامل مع حالة عدم وجود حجوزات
      }
  
      const dateStr = date.toISOString().split("T")[0]; // الحصول على التاريخ بتنسيق YYYY-MM-DD
      // console.log("Current Date:", dateStr); // إضافة لتتبع التاريخ الحالي المُقارن به
  
      for (const reservation of reservations) {
          // console.log("Reservation Start:", reservation.startDate, "End:", reservation.endDate); // إضافة لتتبع تواريخ الحجوزات
          if (dateStr >= reservation.startDate && dateStr <= reservation.endDate) {
              // console.log("Match Found!"); // إضافة لتأكيد العثور على تطابق
              return reservation;
          }
      }
      return null;
  };

  return (
    <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          direction: translations[language].direction,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="h6" component="div">
            {translations[language].title} - {formatMonthYear(currentDate)}
          </Typography>
          <IconButton onClick={goToPreviousMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={goToNextMonth} size="small">
            <ChevronRight />
          </IconButton>
          <Button
            startIcon={<CalendarToday />}
            variant="outlined"
            size="small"
            onClick={goToCurrentMonth}
          >
            {translations[language].currentMonth}
          </Button>
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align={language === "ar" ? "right" : "left"}
                sx={{ fontWeight: "bold" }}
              >
                {translations[language].room}
              </TableCell>
              {dates.map((date) => (
                <TableCell
                  key={date.toISOString()}
                  align="center"
                  sx={{ minWidth: 120 }}
                >
                  {formatDate(date)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roomsData.map((room) => (
              <TableRow key={room.id}>
                <TableCell align={"left"}>
                  <Box sx={{width:"100%"}}>
                    <Typography variant="subtitle2">{room.name}</Typography>
                    <Chip
                      label={room.type}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </TableCell>
                {dates.map((date) => {
                  const bookingInfo = getBookingInfo(room.reservations, date);
                  return bookingInfo ? (
                    <TableCell
                      key={date.toISOString()}
                      align="center"
                      sx={{
                        bgcolor: "primary.lighter",
                        "&:hover": { bgcolor: "primary.light" },
                        borderLeft: "1px dashed rgba(0,0,0,0.1)",
                        borderRight: "1px dashed rgba(0,0,0,0.1)",
                      }}
                    >
                      <Box>
                        <Chip
                          label={bookingInfo.status || "N/A"}
                          color="primary"
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="caption" display="block">
                          {bookingInfo.guestName || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                  ) : (
                    <TableCell
                      key={date.toISOString()}
                      align="center"
                      sx={{
                        bgcolor: "success.lighter",
                        "&:hover": { bgcolor: "success.light" },
                      }}
                    >
                      <Chip
                        label={translations[language].available}
                        variant="outlined"
                        size="small"
                        color="success"
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RoomScheduler;

import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { ChevronLeft, ChevronRight, CalendarToday } from "@mui/icons-material";
import { 
  format, 
  parseISO, 
  differenceInDays, 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval 
} from 'date-fns';

const RoomScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [language, setLanguage] = useState("en");
  const [roomsData, setRoomsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      setRoomsData(data);
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
      room: "الغرفة",
      direction: "rtl",
      search: "بحث",
    },
    en: {
      title: "Room Scheduler",
      currentMonth: "Go to Current Month",
      available: "Available",
      room: "Room",
      direction: "ltr",
      search: "Search",
    },
  };

  const statusColors = {
    1: "#fff3e0", // warning light
    2: "#e8f5e9", // success light
    3: "#e3f2fd", // info light
    4: "#f5f5f5", // default light
    5: "#ffebee", // error light
    6: "#ffebee", // error light
    7: "#fff3e0", // warning light
    8: "#fff3e0", // warning light
    9: "#ffebee", // error light
    10: "#e3f2fd", // info light
    11: "#f5f5f5", // default light
  };

  const statusTextColors = {
    1: "#ed6c02", // warning dark
    2: "#2e7d32", // success dark
    3: "#0288d1", // info dark
    4: "#616161", // default dark
    5: "#d32f2f", // error dark
    6: "#d32f2f", // error dark
    7: "#ed6c02", // warning dark
    8: "#ed6c02", // warning dark
    9: "#d32f2f", // error dark
    10: "#0288d1", // info dark
    11: "#616161", // default dark
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const dates = getDaysInMonth(currentDate);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

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

  const getBookingInfo = (reservations, date, monthStart, monthEnd) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    for (const reservation of reservations) {
      const startDate = parseISO(reservation.startDate);
      const endDate = parseISO(reservation.endDate);
      
      // Check if the current date falls within the reservation period
      if (isWithinInterval(date, { start: startDate, end: endDate })) {
        // Calculate if this is the first visible day of the booking in this month
        const visibleStartDate = startDate < monthStart ? monthStart : startDate;
        const visibleEndDate = endDate > monthEnd ? monthEnd : endDate;
        const isStart = format(date, 'yyyy-MM-dd') === format(visibleStartDate, 'yyyy-MM-dd');
        
        // Calculate remaining days within the current month view
        const daysLeft = differenceInDays(visibleEndDate, date) + 1;
        
        return {
          ...reservation,
          daysLeft,
          isStart,
          visibleStartDate,
          visibleEndDate
        };
      }
    }
    return null;
  };

  const filteredRooms = roomsData.filter((room) => {
    if (!searchTerm) return true;
    const roomNameLower = room.name.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return roomNameLower.includes(searchTermLower);
  });

  return (
    <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          alignItems: "center",
          // justifyContent: "space-between",
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
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label={translations[language].search}
            value={searchTerm}
            size="small"
            onChange={(event) => setSearchTerm(event.target.value)}
            sx={{ width: "200px" }}
          />
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align={language === "ar" ? "right" : "left"}
                sx={{ fontWeight: "bold", width: "250px" }}
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
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell  align={language === "ar" ? "right" : "left"}>
                  <Box sx={{ width: "100px", height:"30px"}}>
                    <Typography variant="subtitle2">{room.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {room.type}
                    </Typography>
                  </Box>
                </TableCell>
                {dates.map((date, index) => {
                  const bookingInfo = getBookingInfo(room.reservations, date, monthStart, monthEnd);
                  
                  // Skip rendering cell if it's part of a merged booking
                  if (bookingInfo && !bookingInfo.isStart) {
                    return null;
                  }

                  if (bookingInfo && bookingInfo.isStart) {
                    const colspan = Math.min(bookingInfo.daysLeft, dates.length - index);
                    return (
                      <TableCell
                        key={date.toISOString()}
                        align="center"
                        colSpan={colspan}
                        sx={{
                          bgcolor: statusColors[bookingInfo.status.id] || '#f5f5f5',
                          color: statusTextColors[bookingInfo.status.id] || '#616161',
                          borderLeft: "1px solid rgba(224, 224, 224, 1)",
                          borderRight: "1px solid rgba(224, 224, 224, 1)",
                          maxHeight: '30px',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            backgroundColor: statusTextColors[bookingInfo.status.id] || '#616161',
                          }
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {bookingInfo.status.name || "N/A"}
                        </Typography>
                        <Typography   sx={{fontSize: "small" ,fontWeight: "bold",maxHeight: '30px'}} variant="caption" display="block">
                          {bookingInfo.guestName || "N/A"} ({bookingInfo.startDate} to  {bookingInfo.endDate})
                        </Typography>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={date.toISOString()}
                      align="center"
                      sx={{
                        bgcolor: '#fafafa',
                        color: '#616161',
                        '&:hover': { bgcolor: '#f5f5f5' },
                      }}
                    >
                      <Typography variant="caption">
                        {translations[language].available}
                      </Typography>
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
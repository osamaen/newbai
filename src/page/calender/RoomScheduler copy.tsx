import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
} from '@mui/icons-material';

const RoomScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [language, setLanguage] = useState('en'); // تحديد اللغة الافتراضية

  const rooms = [
    { id: 1, name: { ar: 'غرفة 101', en: 'Room 101' }, type: { ar: 'مفردة', en: 'Single' } },
    { id: 2, name: { ar: 'غرفة 102', en: 'Room 102' }, type: { ar: 'مزدوجة', en: 'Double' } },
    { id: 3, name: { ar: 'غرفة 103', en: 'Room 103' }, type: { ar: 'جناح', en: 'Suite' } },
  ];


  const translations = {
    ar: { title: 'جدول حجوزات الغرف', currentMonth: 'العودة للشهر الحالي', available: 'متاح', booked: 'محجوز', room: 'الغرفة', direction: 'rtl' },
    en: { title: 'Room Scheduler', currentMonth: 'Go to Current Month', available: 'Available', booked: 'Booked', room: 'Room', direction: 'ltr' }
  };

  const [bookings] = useState({
    '1': [
      { startDate: '2024-12-29', endDate: '2025-01-30', status: { ar: 'محجوز', en: 'Booked' }, guestName: 'Ahmed Mohamed' }
    ],
    '2': [
      { startDate: '2024-12-28', endDate: '2024-12-31', status: { ar: 'محجوز', en: 'Booked' }, guestName: 'Sarah Ahmed' }
    ],
    '3': [
      { startDate: '2024-12-25', endDate: '2024-12-26', status: { ar: 'محجوز', en: 'Booked' }, guestName: 'Khaled Ali' }
    ],
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const dates = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => setCurrentDate(prev => { const newDate = new Date(prev); newDate.setMonth(prev.getMonth() - 1); return newDate; });
  const goToNextMonth = () => setCurrentDate(prev => { const newDate = new Date(prev); newDate.setMonth(prev.getMonth() + 1); return newDate; });
  const goToCurrentMonth = () => setCurrentDate(new Date());

  const formatDate = (date) => date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', day: 'numeric' });
  const formatMonthYear = (date) => date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long' });

  const getBookingInfo = (roomId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const roomBookings = bookings[roomId.toString()] || [];
    for (const booking of roomBookings) {
      if (dateStr >= booking.startDate && dateStr <= booking.endDate) {
        return booking;
      }
    }
    return null;
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', direction: translations[language].direction }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {translations[language].title} - {formatMonthYear(currentDate)}
        </Typography>
        <IconButton onClick={language === 'ar' ? goToPreviousMonth : goToNextMonth} size="small">
          {language === 'ar' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        <IconButton onClick={language === 'ar' ? goToNextMonth : goToPreviousMonth} size="small">
          {language === 'ar' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
        <Button startIcon={<CalendarToday />} variant="outlined" size="small" onClick={goToCurrentMonth}>
          {translations[language].currentMonth}
        </Button>
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align={language === 'ar' ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{translations[language].room}</TableCell>
              {dates.map(date => (
                <TableCell key={date.toISOString()} align="center" sx={{ minWidth: 120 }}>{formatDate(date)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map(room => (
              <TableRow key={room.id}>
                <TableCell align={language === 'ar' ? 'right' : 'left'}>
                  <Box>
                    <Typography variant="subtitle2">{room.name[language]}</Typography>
                    <Chip label={room.type[language]} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                  </Box>
                </TableCell>
                {dates.map(date => {
                  const bookingInfo = getBookingInfo(room.id, date);
                  return bookingInfo ? (
                    <TableCell
                      key={date.toISOString()}
                      align="center"
                      sx={{
                        bgcolor: 'primary.lighter',
                        '&:hover': { bgcolor: 'primary.light' },
                        borderLeft: '1px dashed rgba(0,0,0,0.1)',
                        borderRight: '1px dashed rgba(0,0,0,0.1)'
                      }}
                    >
                      <Box>
                        <Chip label={bookingInfo.status[language]} color="primary" size="small" sx={{ mb: 0.5 }} />
                        <Typography variant="caption" display="block">{bookingInfo.guestName}</Typography>
                      </Box>
                    </TableCell>
                  ) : (
                    <TableCell
                      key={date.toISOString()}
                      align="center"
                      sx={{
                        bgcolor: 'success.lighter',
                        '&:hover': { bgcolor: 'success.light' }
                      }}
                    >
                      <Chip label={translations[language].available} variant="outlined" size="small" color="success" />
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
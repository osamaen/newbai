import { useState, useEffect } from 'react';
import { reservationStatusesApi } from '../api/reservationStatusesApi';

export const useReservationStatuses = () => {
  const [reservation_statuses, setReservationStatuses] = useState([]);
  const [reservationStatusesloading, setReservationStatusesloading] = useState(false);
  const [reservationStatusesError, setReservationStatusesError] = useState(null);

  const fetchReservationStatuses = async () => {
    setReservationStatusesloading(true);
    try {
      const data = await reservationStatusesApi.getAllReservationStatuses();
      setReservationStatuses(data.data.reservation_statuses[0]);
    } catch (err) {
      setReservationStatusesError(err.message);
    } finally {
      setReservationStatusesloading(false);
    }
  };

  useEffect(() => {
    fetchReservationStatuses();
  }, []);

  return { reservation_statuses, reservationStatusesloading, reservationStatusesError, refetch: fetchReservationStatuses };
};
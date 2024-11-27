import { useState, useEffect } from 'react';
import { reservationTypesApi } from '../api/reservationTypesApi';

export const useReservationTypes = () => {
  const [reservation_types, setReservationTypes] = useState([]);
  const [reservationTypesloading, setReservationTypesloading] = useState(false);
  const [reservationTypesError, setReservationTypesError] = useState(null);

  const fetchReservationTypes = async () => {
    setReservationTypesloading(true);
    try {
      const data = await reservationTypesApi.getAllReservationTypes();
      setReservationTypes(data.data.reservationTypes[0]);
    } catch (err) {
      setReservationTypesError(err.message);
    } finally {
      setReservationTypesloading(false);
    }
  };

  useEffect(() => {
    fetchReservationTypes();
  }, []);

  return { reservation_types, reservationTypesloading, reservationTypesError, refetch: fetchReservationTypes };
};
import { useState, useEffect } from 'react';
import { roomTypesApi } from '../api/roomTypesApi';

export const useRoomTypes = () => {
  const [room_types, setRoomTypes] = useState([]);
  const [roomTypesloading, setRoomTypesloading] = useState(false);
  const [roomTypesError, setRoomTypesError] = useState(null);

  const fetchRoomTypes = async () => {
    setRoomTypesloading(true);
    try {
      const data = await roomTypesApi.getAllRoomTypes();
      setRoomTypes(data.data.roomTypes[0]);
    } catch (err) {
      setRoomTypesError(err.message);
    } finally {
      setRoomTypesloading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return { room_types, roomTypesloading, roomTypesError, refetch: fetchRoomTypes };
};
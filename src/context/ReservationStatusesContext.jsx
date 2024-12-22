import React, { createContext, useContext } from 'react';
import { useReservationStatuses } from '../hooks/useReservationStatuses';

const ReservationStatusesContext = createContext();

export const ReservationStatusesProvider = ({ children }) => {
  const ReservationStatusesData = useReservationStatuses();

  return (
    <ReservationStatusesContext.Provider value={ReservationStatusesData}>
      {children}
    </ReservationStatusesContext.Provider>
  );
};

export const useReservationStatusesContext = () => {
  const context = useContext(ReservationStatusesContext);
  if (!context) {
    throw new Error('useBuildingsContext must be used within a CitiesProvider');
  }
  return context;
};
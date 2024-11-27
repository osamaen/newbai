import React, { createContext, useContext } from 'react';
import { useReservationTypes } from '../hooks/useReservationTypes';

const ReservationTypesContext = createContext();

export const ReservationTypesProvider = ({ children }) => {
  const ReservationTypesData = useReservationTypes();

  return (
    <ReservationTypesContext.Provider value={ReservationTypesData}>
      {children}
    </ReservationTypesContext.Provider>
  );
};

export const useReservationTypesContext = () => {
  const context = useContext(ReservationTypesContext);
  if (!context) {
    throw new Error('useBuildingsContext must be used within a CitiesProvider');
  }
  return context;
};
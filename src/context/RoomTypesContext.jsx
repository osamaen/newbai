import React, { createContext, useContext } from 'react';
import { useRoomTypes } from '../hooks/useRoomTypes';

const RoomTypesContext = createContext();

export const RoomTypesProvider = ({ children }) => {
  const RoomTypesData = useRoomTypes();

  return (
    <RoomTypesContext.Provider value={RoomTypesData}>
      {children}
    </RoomTypesContext.Provider>
  );
};

export const useRoomTypesContext = () => {
  const context = useContext(RoomTypesContext);
  if (!context) {
    throw new Error('useBuildingsContext must be used within a CitiesProvider');
  }
  return context;
};
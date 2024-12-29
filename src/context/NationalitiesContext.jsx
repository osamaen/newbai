import React, { createContext, useContext } from 'react';
import { useNationalities } from '../hooks/useNationalities';

const NationalitiesContext = createContext();

export const NationalitiesProvider = ({ children }) => {
  const nationalitiesData = useNationalities();

  return (
    <NationalitiesContext.Provider value={nationalitiesData}>
      {children}
    </NationalitiesContext.Provider>
  );
};

export const useNationalitiesContext = () => {
  const context = useContext(NationalitiesContext);
  if (!context) {
    throw new Error('useBuildingsContext must be used within a CitiesProvider');
  }
  return context;
};
import React, { createContext, useContext } from 'react';
import { useBuildings } from '../hooks/useBuildings';

const BuildingsContext = createContext();

export const BuildingsProvider = ({ children }) => {
  const BuildingsData = useBuildings();

  return (
    <BuildingsContext.Provider value={BuildingsData}>
      {children}
    </BuildingsContext.Provider>
  );
};

export const useBuildingsContext = () => {
  const context = useContext(BuildingsContext);
  if (!context) {
    throw new Error('useBuildingsContext must be used within a CitiesProvider');
  }
  return context;
};
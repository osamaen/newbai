import React, { createContext, useContext } from 'react';
import { useLeadSources } from '../hooks/useLeadSources';

const LeadSourcesContext = createContext();

export const LeadSourcesProvider = ({ children }) => {
  const leadSourcesData = useLeadSources();

  return (
    <LeadSourcesContext.Provider value={leadSourcesData}>
      {children}
    </LeadSourcesContext.Provider>
  );
};

export const useLeadSourcesContext = () => {
  const context = useContext(LeadSourcesContext);
  if (!context) {
    throw new Error('useBuildingsContext must be used within a CitiesProvider');
  }
  return context;
};
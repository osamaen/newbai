import { useState, useEffect } from 'react';
import { leadSourcesApi } from '../api/leadSourcesApi';

export const useLeadSources = () => {
  const [lead_sources, setLeadSources] = useState([]);
  const [leadSourcesLoading, setLeadSourcesloading] = useState(false);
  const [leadSourcesError, setLeadSourcesError] = useState(null);

  const fetchLeadSources = async () => {
    setLeadSourcesloading(true);
    try {
      const data = await leadSourcesApi.getAllLeadSources();
      setLeadSources(data.data.lead_sources[0]);
    } catch (err) {
      setLeadSourcesError(err.message);
    } finally {
      setLeadSourcesloading(false);
    }
  };

  useEffect(() => {
    fetchLeadSources();
  }, []);

  return { lead_sources, leadSourcesLoading, leadSourcesError, refetch: fetchLeadSources};
};
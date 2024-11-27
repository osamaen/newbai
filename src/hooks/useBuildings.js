import { useState, useEffect } from 'react';
import { buildingsApi } from '../api/buildingsApi';

export const useBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await buildingsApi.getAllBuildings();
      setBuildings(data.data.buildings[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return { buildings, loading, error, refetch: fetchBuildings };
};
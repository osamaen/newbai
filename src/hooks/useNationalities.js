import { useState, useEffect } from 'react';
import { nationalitiesApi } from '../api/nationalitiesApi';

export const useNationalities = () => {
  const [nationalities, setNationalities] = useState([]);
  const [nationalitiesloading, setNationalitiesloading] = useState(false);
  const [nationalitiesError, setNationalitiesError] = useState(null);

  const fetchNationalities = async () => {
    setNationalitiesloading(true);
    try {
      const data = await nationalitiesApi.getNationalities();
      setNationalities(data.data.nationalities[0]);
    } catch (err) {
      setNationalitiesError(err.message);
    } finally {
      setNationalitiesloading(false);
    }
  };

  useEffect(() => {
    fetchNationalities();
  }, []);

  return { nationalities, nationalitiesloading, nationalitiesError, refetch: fetchNationalities};
};
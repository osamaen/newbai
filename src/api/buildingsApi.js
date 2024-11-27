import axios from 'axios';
// import { API_ENDPOINTS } from './endpoints';
import axiosInstance from './axiosConfig';

export const buildingsApi = {
  getAllBuildings: async () => {
    try {
      const response = await axiosInstance.get("/buildings");
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch buildings: ' + error.message);
    }
  },
  
  getBuildingById: async (id) => {
    try {
      const response = await axios.get(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch building ${id}: ${error.message}`);
    }
  }
};
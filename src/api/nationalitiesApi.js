import axios from 'axios';
// import { API_ENDPOINTS } from './endpoints';
import axiosInstance from './axiosConfig';

export const nationalitiesApi = {
  getNationalities: async () => {
    try {
      const response = await axiosInstance.get("/nationalities");
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch room-types: ' + error.message);
    }
  }
  
 
};
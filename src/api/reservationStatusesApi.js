import axios from 'axios';
// import { API_ENDPOINTS } from './endpoints';
import axiosInstance from './axiosConfig';

export const reservationStatusesApi = {
  getAllReservationStatuses: async () => {
    try {
      const response = await axiosInstance.get("/reservation-statuses");
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch room-types: ' + error.message);
    }
  }
  
 
};
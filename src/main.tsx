import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Dashboard from "./page/dashboard/Dashboard";
import Buildings from "./page/Buildings/Buildings";
import AddBuildings from "./page/Buildings/AddBuilding";
import EditBuilding from "./page/Buildings/EditBuilding";

import AddBooking from "./page/bookings/AddBooking";


import Rooms from "./page/rooms/Rooms";
import AddRoom from "./page/rooms/AddRoom";
import EditRoom from "./page/rooms/EditRoom";
import RoomsAvailability from "./page/rooms/RoomsAvailability";
import Bedspaces from "./page/rooms/Bedspaces";


import Apartments from "./page/apartments/Apartments";
import AddApartment from "./page/apartments/AddApartment";
import EditApartment from "./page/apartments/EditApartment";

import Bookings from "./page/bookings/Bookings";
import TodayCheckOut from "./page/bookings/TodayCheckOut";
import TodayCheckIn from "./page/bookings/TodayCheckIn";


import Customers from "./page/customers/Customers";
import AddCustomer from "./page/customers/AddCustomer";
import EditCustomer from "./page/customers/EditCustomer";

import Users from "./page/users/Users";
import AddUser from "./page/users/AddUser";
import EditUser from "./page/users/EditUser";
import BarChart from "./page/barChart/BarChart";
import PieChart from "./page/pieChart/PieChart";
import LineChart from "./page/lineChart/LineChart";
import Geography from "./page/geography/Geography";
import NotFound from "./page/notFound/NotFound";
import EditBooking from "./page/bookings/EditBooking";
import Calender from "./page/calender/Calender";
import RoomScheduler from "./page/calender/RoomScheduler";

const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path="/" element={<App />}>
      <Route index path="dashboard" element={<Dashboard />} />
      <Route path="login" element={<App />} />
      <Route path="buildings/list" element={<Buildings />} />
      <Route path="buildings/add" element={<AddBuildings />} />
      <Route path="buildings/:id/edit" element={<EditBuilding />} />
    

      <Route path="apartments/list" element={<Apartments />} />
      <Route path="apartment/add" element={<AddApartment />} />
      <Route path="apartment/:id/edit" element={<EditApartment />} />

 
      <Route path="room/add" element={<AddRoom />} />
      {/* <Route path="room/:id/edit" element={<EditRoom />} /> */}
  

      <Route path="rooms/list" element={<Rooms />} />
      <Route path="rooms/:id/bedspaces" element={<Bedspaces />} />
      <Route path="rooms/available" element={<RoomsAvailability />} />

      <Route path="bookings/list" element={<Bookings />} />
      <Route path="bookings/add" element={<AddBooking />} />
      <Route path="bookings/:id/edit" element={<EditBooking />} />
      <Route path="bookings/today-check-in" element={<TodayCheckIn />} />
      <Route path="bookings/today-check-out" element={<TodayCheckOut />} />

      
      <Route path="customers" element={<Customers />} />
      <Route path="customers/add" element={<AddCustomer />} />
      <Route path="customers/:id/edit" element={<EditCustomer />} />

      <Route path="calender" element={<Calender />} />
      <Route path="scheduler" element={<RoomScheduler />} />


      <Route path="users" element={<Users />} />
      <Route path="users/add" element={<AddUser />} />
      <Route path="users/:id/edit" element={<EditUser />} />




      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

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
import Customers from "./page/customers/Customers";

import Users from "./page/users/Users";
import BarChart from "./page/barChart/BarChart";
import PieChart from "./page/pieChart/PieChart";
import LineChart from "./page/lineChart/LineChart";
import Geography from "./page/geography/Geography";
import NotFound from "./page/notFound/NotFound";
import EditDoctor from "./page/Buildings/EditBuilding";
import EditBooking from "./page/bookings/EditBooking";

const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path="/" element={<App />}>
      <Route index path="dashboard" element={<Dashboard />} />
      <Route path="login" element={<App />} />
      <Route path="buildings/list" element={<Buildings />} />
      <Route path="doctors/add" element={<AddBuildings />} />
      <Route path="doctors/:id/edit" element={<EditDoctor />} />
    

      <Route path="apartments/list" element={<Apartments />} />
      <Route path="apartment/add" element={<AddApartment />} />
      <Route path="apartment/:id/edit" element={<EditApartment />} />

 
      <Route path="room/add" element={<AddRoom />} />
      {/* <Route path="room/:id/edit" element={<EditRoom />} /> */}
  

      <Route path="rooms/list" element={<Rooms />} />
      <Route path="rooms/:id/bedspaces" element={<Bedspaces />} />
      <Route path="rooms/available" element={<RoomsAvailability />} />

      <Route path="bookings" element={<Bookings />} />
      <Route path="bookings/add" element={<AddBooking />} />
      <Route path="bookings/:id/edit" element={<EditBooking />} />

      
      <Route path="customers" element={<Customers />} />
      <Route path="users" element={<Users />} />




      <Route path="bar" element={<BarChart />} />
      <Route path="pie" element={<PieChart />} />
      <Route path="line" element={<LineChart />} />
      <Route path="geography" element={<Geography />} />




      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

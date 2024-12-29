import { Paper, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react"
import Card from "./card";
import BuildingsChart from "./BuildingsChart";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import { data2, data3, data4 } from "./data";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
const Row1 = () => {

 const [totalOccupancy, setTotalOccupancy] = useState([]);
 const [summary, setSummary] = useState([]);

 const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
 const [buildingData, setBuildingData] = useState({
    labels: [],
    datasets: [],
  });

const [loading, setLoading] = useState(true);

  const fetchDailyOccupancy = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/daily-occupancy`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );

      const result = await response.json();

      if (result.statusCode === 200 && result.data) {
        const data = result.data;

        // إعداد بيانات المخطط
        const occupiedColor = data.occupied_options > 50 ? "#FF5733" : "#FFB533";  // لون يعتمد على القيمة
        const availableColor = data.available_options > 50 ? "#33FF57" : "#33B5FF";
        
        setChartData({
          labels: ["Occupied Options", "Available Options"],
          datasets: [
            {
              data: [data.occupied_options, data.available_options],
              backgroundColor: ["#FF6384", "#36A2EB"],  // الأحمر (مشغول) والأزرق (متاح)
              // hoverBackgroundColor: ["#FF5733", "#3399FF"], // تغيير الألوان عند التمرير
            },
          ],
        });
        
      } else {
        console.error(
          "Error fetching data:",
          result.message || "No data returned"
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchDailyOccupancyByBuildings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/daily-occupancy-by-building`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );

      const result = await response.json();

      if (result.statusCode === 200 && result.data) {
        const data = result.data;

        const labels = data.map(building => building.building_name);
        const occupancyRates = data.map(building => building.occupancy_rate);

        setBuildingData({
          labels: labels,
          datasets: [
            {
              data: occupancyRates,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],  // ألوان مخصصة لكل قطاع في المخطط
              borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],  // يمكن إضافة حدود لتوضيح الفواصل
              borderWidth: 1,
            },
          ],
        });
        // setChartData({
        //   labels: ["Occupied Options", "Available Options"],
        //   datasets: [
        //     {
        //       data: [data.occupied_options, data.available_options],
        //       backgroundColor: ["#FF6384", "#36A2EB"],  // الأحمر (مشغول) والأزرق (متاح)
        //       // hoverBackgroundColor: ["#FF5733", "#3399FF"], // تغيير الألوان عند التمرير
        //     },
        //   ],
        // });
        
      } else {
        console.error(
          "Error fetching data:",
          result.message || "No data returned"
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyOccupancy();
    fetchDailyOccupancyByBuildings();
  }, []);

  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
 
      gap={1}
      justifyContent={{ xs: "center", sm: "space-between" }}
    >
      <Card
        icon={<EmailIcon
          sx={{ fontSize: "40px", color: theme.palette.secondary.main }} />}
        title={"Total Occupancy"}
        subTitle={2}
        // increase={"+14%"}
        data={chartData} scheme={"nivo"}      />



<BuildingsChart

        icon={<EmailIcon
          sx={{ fontSize: "40px", color: theme.palette.secondary.main }} />}
        title={"Occupancy Rate per Building"}
    
        // increase={"+14%"}
        data={buildingData} scheme={"nivo"}      />
<BuildingsChart

        icon={<EmailIcon
          sx={{ fontSize: "40px", color: theme.palette.secondary.main }} />}
        title={"Occupancy Rate per Room Type"}
    
        // increase={"+14%"}
        data={buildingData} />
        <BuildingsChart

icon={<EmailIcon
  sx={{ fontSize: "40px", color: theme.palette.secondary.main }} />}
title={"Occupancy Rate per Building"}

// increase={"+14%"}
data={buildingData} />
    </Stack>
  );
};

export default Row1;

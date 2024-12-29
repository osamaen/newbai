import React, { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // استيراد المكتبة
import { Paper, Stack } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // إضافة المكتبة إلى الرسم

const Row1 = () => {
  const [chartData, setChartData] = useState({
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
        setChartData({
          labels: ["Occupied Options", "Available Options"],
          datasets: [
            {
              data: [data.occupied_options, data.available_options],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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

  useEffect(() => {
    fetchDailyOccupancy();
  }, []);

  return (
    <div style={{ width: "250px", height: "300px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3}>
          <div style={{ width: "250px", height: "300px" }}>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset.data;
                        const total = dataset.reduce(
                          (sum, value) => sum + value,
                          0
                        );
                        const currentValue = dataset[tooltipItem.dataIndex];
                        const percentage = (
                          (currentValue / total) *
                          100
                        ).toFixed(2); // النسبة المئوية

                        return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
                      },
                    },
                  },
                  title: {
                    display: true,
                    text: "Room Occupancy Overview (Percentage)",
                  },
                  datalabels: {
                    color: "#fff", // لون النص داخل الدائرة
                    formatter: (value, context) => {
                      const total = context.dataset.data.reduce(
                        (sum, value) => sum + value,
                        0
                      );
                      const percentage = ((value / total) * 100).toFixed(2);
                      return `${percentage}%`; // عرض النسبة المئوية
                    },
                    font: {
                      weight: "bold", // جعل الخط عريضًا
                      size: 16, // حجم الخط
                    },
                  },
                },
              }}
            />
          </div>

          <div style={{ width: "250px", height: "300px" }}>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset.data;
                        const total = dataset.reduce(
                          (sum, value) => sum + value,
                          0
                        );
                        const currentValue = dataset[tooltipItem.dataIndex];
                        const percentage = (
                          (currentValue / total) *
                          100
                        ).toFixed(2); // النسبة المئوية

                        return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
                      },
                    },
                  },
                  title: {
                    display: true,
                    text: "Room Occupancy Overview (Percentage)",
                  },
                  datalabels: {
                    color: "#fff", // لون النص داخل الدائرة
                    formatter: (value, context) => {
                      const total = context.dataset.data.reduce(
                        (sum, value) => sum + value,
                        0
                      );
                      const percentage = ((value / total) * 100).toFixed(2);
                      return `${percentage}%`; // عرض النسبة المئوية
                    },
                    font: {
                      weight: "bold", // جعل الخط عريضًا
                      size: 16, // حجم الخط
                    },
                  },
                },
              }}
            />
          </div>
        </Stack>
      )}
    </div>
  );
};

export default Row1;

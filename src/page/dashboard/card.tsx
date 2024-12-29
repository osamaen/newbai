import React from "react";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
// import { ResponsivePie } from "@nivo/pie";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // استيراد المكتبة


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // إضافة المكتبة إلى الرسم

const Card = ({ icon, title, subTitle, increase, data, scheme }) => {

  const theme = useTheme();
  return (
    <Paper
      sx={{
        flexGrow: 1,
        minWidth: "333px",
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack gap={1}    sx={{
        flexGrow: 1,
        minWidth: "333px",
        p: 1.5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        {/* {icon} */}
        <Typography variant="body2" sx={{ fontSize: "30px" }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "25px" }}>
          {subTitle}
        </Typography>
      </Stack>

      <Stack alignItems={"center"}>
        <Box height={"200px"} width={"200px"}>
        <Pie
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "none",
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
                      size: 12, // حجم الخط
                    },
                  },
                },
              }}
            />
        </Box>
        {/* <Typography variant="body2">{increase}</Typography> */}
      </Stack>
    </Paper>
  );
};

export default Card;

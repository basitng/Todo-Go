import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import { Chart } from "../../components/chart";
import instance from "../../utils/axios";

const AverageTodosDuration = ({ sx }) => {
  const [chartData, setChartData] = useState({
    averageDurationByDay: [],
    daysInMonth: 0,
  });

  const fetchAverageTodoDuration = async () => {
    try {
      const response = await instance.get("/todos/average-todo-duration");
      setChartData({
        daysInMonth: response.data.totalMonths,
        averageDurationByDay: response.data.averageDurationByDay,
      });
    } catch (error) {
      console.error("Error fetching average todo duration:", error);
    }
  };

  useEffect(() => {
    fetchAverageTodoDuration();
  }, []);

  const chartOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    // ...other chart options...
    xaxis: {
      // ...other xaxis options...
      categories: Array.from(
        { length: chartData.daysInMonth },
        (_, index) => index + 1
      ),
    },
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Average Todo Duration" />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={[
            {
              name: "series-1",
              data: chartData.averageDurationByDay,
            },
          ]}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Average Duration
        </Typography>
      </Box>
    </Card>
  );
};

AverageTodosDuration.propTypes = {
  sx: PropTypes.object,
};

export default AverageTodosDuration;

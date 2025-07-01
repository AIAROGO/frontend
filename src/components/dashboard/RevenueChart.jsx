import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const { darkMode } = useTheme();

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
        color: darkMode ? '#e5e7eb' : '#374151',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
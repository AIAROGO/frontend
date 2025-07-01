import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DepartmentOccupancyChart = () => {
  const { darkMode } = useTheme();

  const data = {
    labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'],
    datasets: [
      {
        label: 'Occupied Beds',
        data: [5, 6, 7, 0, 0],
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 1,
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
        text: 'Department Occupancy',
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
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DepartmentOccupancyChart;
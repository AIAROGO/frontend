import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const BedOccupancyChart = () => {
  const { darkMode } = useTheme();

  const data = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [172, 48],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
        borderColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
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
        text: 'Bed Occupancy',
        color: darkMode ? '#e5e7eb' : '#374151',
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default BedOccupancyChart;
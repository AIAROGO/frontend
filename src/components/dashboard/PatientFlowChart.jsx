import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '../../context/ThemeContext'; // Assuming ThemeContext is available

const PatientFlowChart = () => {
  const chartRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const chart = echarts.init(chartDom, darkMode ? 'dark' : 'light', { renderer: 'canvas' });
    const option = {
      animation: false,
      title: {
        text: 'Patient Flow',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'normal', color: darkMode ? '#ffffff' : '#000000' },
      },
      tooltip: { trigger: 'axis' },
      legend: { top: 'bottom', textStyle: { color: darkMode ? '#ffffff' : '#000000' } },
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisLabel: { color: darkMode ? '#ffffff' : '#000000' } },
      yAxis: { type: 'value', axisLabel: { color: darkMode ? '#ffffff' : '#000000' } },
      series: [
        { name: 'Inpatient', type: 'line', smooth: true, data: [0, 0, 0, 0, 0, 0, 0], itemStyle: { color: '#3B82F6' } },
        { name: 'Outpatient', type: 'line', smooth: true, data: [0, 0, 0, 0, 0, 0, 0], itemStyle: { color: '#10B981' } },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [darkMode]);

  return <div ref={chartRef} style={{ height: '300px', width: '100%' }} />;
};

export default PatientFlowChart;
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const PatientFlowChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animation: false,
      title: {
        text: 'Patient Flow',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'normal' },
      },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      yAxis: { type: 'value' },
      series: [
        { name: 'Inpatient', type: 'line', smooth: true, data: [30, 42, 51, 54, 48, 38, 32], itemStyle: { color: '#3B82F6' } },
        { name: 'Outpatient', type: 'line', smooth: true, data: [120, 132, 141, 154, 162, 110, 98], itemStyle: { color: '#10B981' } },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div id="patient-flow-chart" ref={chartRef} style={{ height: '300px' }}></div>;
};

export default PatientFlowChart;
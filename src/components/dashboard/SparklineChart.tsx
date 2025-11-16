import React from 'react';
import ReactECharts from 'echarts-for-react';

interface SparklineChartProps {
  data: number[];
  color?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, color = '#3b82f6' }) => {
  const option = {
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 5,
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: color,
          width: 2,
        },
        areaStyle: {
            color: color,
            opacity: 0.1
        }
      },
    ],
    tooltip: {
        trigger: 'axis',
        formatter: '{c}'
    }
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default SparklineChart;

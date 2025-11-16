import React, { useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsInstance } from 'echarts-for-react';

interface RealTimeChartProps {
  title: string;
  initialData: number[];
  color: string;
  yAxisMin?: number;
  yAxisMax?: number;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ title, initialData, color, yAxisMin, yAxisMax }) => {
  const chartRef = useRef<EChartsInstance>(null);

  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      max: 200, // Show 200 points at a time
    },
    yAxis: {
      type: 'value',
      min: yAxisMin,
      max: yAxisMax,
      splitLine: { lineStyle: { color: '#334155' } },
      axisLine: { lineStyle: { color: '#475569' } },
    },
    series: [
      {
        data: initialData,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: color,
          width: 2,
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: '{c}',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderColor: '#475569',
      textStyle: {
        color: '#e2e8f0'
      }
    },
  };

  return <ReactECharts ref={chartRef} option={option} style={{ height: '100%', width: '100%' }} notMerge={false} lazyUpdate={true} />;
};

export default RealTimeChart;

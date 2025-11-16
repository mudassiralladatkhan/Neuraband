import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from '../ui/Card';
import { HrvData } from '../../types/neuraband';

interface HrvChartProps {
  data: HrvData;
}

const HrvChart: React.FC<HrvChartProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderColor: '#475569',
      textStyle: {
        color: '#e2e8f0'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.timestamps,
      axisLine: { lineStyle: { color: '#475569' } },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#475569' } },
      splitLine: { lineStyle: { color: '#334155' } },
    },
    series: [
      {
        name: 'HRV (ms)',
        type: 'line',
        smooth: true,
        data: data.values,
        itemStyle: { color: '#38bdf8' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(56, 189, 248, 0.3)'
            }, {
              offset: 1, color: 'rgba(56, 189, 248, 0)'
            }]
          }
        }
      },
    ],
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <h3 className="text-lg font-semibold">Heart Rate Variability (HRV) - Last 24h</h3>
      <div style={{ height: '300px', width: '100%' }} className="mt-4">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Card>
  );
};

export default HrvChart;

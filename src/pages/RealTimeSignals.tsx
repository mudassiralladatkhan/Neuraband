import React, { useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import RealTimeChart from '../components/signals/RealTimeChart';
import { useNeuraBand } from '../contexts/NeuraBandContext';
import { Play, Pause } from 'lucide-react';

const RealTimeSignals: React.FC = () => {
  const { data, isPlaying, setIsPlaying, connectionStatus } = useNeuraBand();
  const signals = data?.signals;

  const chartRefs = {
    ecg: useRef<any>(null),
    ppg: useRef<any>(null),
    imu: useRef<any>(null),
  };

  useEffect(() => {
    if (!isPlaying || !signals) return;

    const updateChart = (chartRef: React.RefObject<any>, seriesUpdates: { data: number[] }[]) => {
      const instance = chartRef.current?.getEchartsInstance();
      if (instance) {
        instance.setOption({
          series: seriesUpdates.map((update, index) => ({
            id: `series-${index}`,
            data: update.data,
          })),
        });
      }
    };
    
    updateChart(chartRefs.ecg, [{ data: signals.ecg }]);
    updateChart(chartRefs.ppg, [{ data: signals.ppg }]);
    updateChart(chartRefs.imu, [
      { data: signals.imu.x },
      { data: signals.imu.y },
      { data: signals.imu.z },
    ]);

  }, [signals, isPlaying, chartRefs.ecg, chartRefs.ppg, chartRefs.imu]);
  
  if (connectionStatus === 'connecting') {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Connecting to NeuraBand...</div>;
  }

  if (!signals) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Waiting for signal data...</div>;
  }

  const imuOption = {
    title: { text: 'IMU (Accelerometer)', left: 'center', textStyle: { color: '#e2e8f0', fontSize: 16, fontWeight: 'normal' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: { type: 'value', show: false, max: signals.imu.x.length },
    yAxis: { type: 'value', min: -1.5, max: 1.5, splitLine: { lineStyle: { color: '#334155' } }, axisLine: { lineStyle: { color: '#475569' } } },
    legend: { data: ['X', 'Y', 'Z'], bottom: 10, textStyle: { color: '#94a3b8' } },
    series: [
      { id: 'series-0', name: 'X', data: signals.imu.x, type: 'line', smooth: true, showSymbol: false, lineStyle: { color: '#38bdf8', width: 2 } },
      { id: 'series-1', name: 'Y', data: signals.imu.y, type: 'line', smooth: true, showSymbol: false, lineStyle: { color: '#f43f5e', width: 2 } },
      { id: 'series-2', name: 'Z', data: signals.imu.z, type: 'line', smooth: true, showSymbol: false, lineStyle: { color: '#34d399', width: 2 } },
    ],
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569', textStyle: { color: '#e2e8f0' } },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center px-4 py-2 bg-accent text-primary rounded-md hover:bg-accent/80 transition-colors"
        >
          {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80"><RealTimeChart ref={chartRefs.ecg} title="ECG" initialData={signals.ecg} color="#f43f5e" yAxisMin={-1} yAxisMax={3.5} /></Card>
        <Card className="h-80"><RealTimeChart ref={chartRefs.ppg} title="PPG" initialData={signals.ppg} color="#38bdf8" yAxisMin={-1} yAxisMax={1} /></Card>
        <Card className="lg:col-span-2 h-80">
            <RealTimeChart ref={chartRefs.imu} option={imuOption} style={{ height: '100%', width: '100%' }} notMerge={false} lazyUpdate={true} />
        </Card>
      </div>
    </div>
  );
};

export default RealTimeSignals;

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ScoreCard } from '../components/dashboard/ScoreCard';
import HrvChart from '../components/dashboard/HrvChart';
import DeviceStatus from '../components/dashboard/DeviceStatus';
import { Skeleton } from '../components/ui/Skeleton';
import { Heart, Thermometer, Zap, Activity, Brain, BarChart } from 'lucide-react';
import { NeuraBandData } from '../types/neuraband';
import { Database } from '../types/database.types';

type BiosignalRow = Database['public']['Tables']['biosignals']['Row'];

const DashboardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Skeleton className="h-48" />
    <Skeleton className="h-48" />
    <Skeleton className="h-48" />
    <Skeleton className="h-48" />
    <Skeleton className="h-96 col-span-1 lg:col-span-2" />
    <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-16">
    <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-2 text-lg font-medium text-foreground">No Data Yet</h3>
    <p className="mt-1 text-sm text-muted-foreground">
      Start a session on your NeuraBand device to see your data here.
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [displayData, setDisplayData] = useState<NeuraBandData | null>(null);
  const [loading, setLoading] = useState(true);

  const processInitialData = (history: BiosignalRow[]): NeuraBandData => {
    const latestSignal = history[history.length - 1];
    return {
      heartRate: { value: latestSignal.heart_rate || 0, unit: 'BPM', label: 'Heart Rate', sparkline: history.map(d => d.heart_rate || 0) },
      spo2: { value: latestSignal.spo2 || 0, unit: '%', label: 'SpO2', sparkline: history.map(d => d.spo2 || 0) },
      temperature: { value: latestSignal.temperature || 0, unit: '°C', label: 'Body Temp', sparkline: history.map(d => d.temperature || 0) },
      stress: { score: latestSignal.stress_score || 0, level: (latestSignal.stress_score || 0) < 40 ? 'Low' : 'Moderate', label: 'Stress' },
      motion: { score: latestSignal.motion_score || 0, level: (latestSignal.motion_score || 0) < 30 ? 'Low' : 'Moderate', label: 'Motion' },
      hrv: {
        timestamps: history.map(d => new Date(d.timestamp).toLocaleTimeString()),
        values: history.map(d => d.hrv || 0)
      },
      deviceStatus: [{ name: 'Battery', status: 'ok' }, { name: 'ECG', status: 'ok' }, { name: 'PPG', status: 'ok' }, { name: 'IMU', status: 'ok' }],
      // These are not needed for the dashboard view
      signals: { ecg: [], ppg: [], imu: { x: [], y: [], z: [] } },
      detailedStatus: [],
      settings: { samplingRates: { ecg: 250, ppg: 100, imu: 100, gsr: 25 }, model: 'neuraband_B_float16.tflite' },
      logs: [],
    };
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('biosignals')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true }) // Fetch oldest to newest
        .limit(20);

      if (error) {
        console.error('Error fetching initial data:', error);
      } else if (data && data.length > 0) {
        setDisplayData(processInitialData(data));
      }
      setLoading(false);
    };

    fetchInitialData();

    const channel = supabase
      .channel('public:biosignals')
      .on<BiosignalRow>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'biosignals', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          const newSignal = payload.new;
          setDisplayData(prevData => {
            // If there's no previous data, create it from this new signal
            if (!prevData) {
              return processInitialData([newSignal]);
            }
            
            // Otherwise, update the existing data
            return {
              ...prevData,
              heartRate: { ...prevData.heartRate, value: newSignal.heart_rate || 0, sparkline: [...prevData.heartRate.sparkline.slice(1), newSignal.heart_rate || 0] },
              spo2: { ...prevData.spo2, value: newSignal.spo2 || 0, sparkline: [...prevData.spo2.sparkline.slice(1), newSignal.spo2 || 0] },
              temperature: { ...prevData.temperature, value: newSignal.temperature || 0, sparkline: [...prevData.temperature.sparkline.slice(1), newSignal.temperature || 0] },
              stress: { ...prevData.stress, score: newSignal.stress_score || 0, level: (newSignal.stress_score || 0) < 40 ? 'Low' : 'Moderate' },
              motion: { ...prevData.motion, score: newSignal.motion_score || 0, level: (newSignal.motion_score || 0) < 30 ? 'Low' : 'Moderate' },
              hrv: {
                  timestamps: [...prevData.hrv.timestamps.slice(1), new Date(newSignal.timestamp).toLocaleTimeString()],
                  values: [...prevData.hrv.values.slice(1), newSignal.hrv || 0]
              },
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard metric={displayData.heartRate} icon={Heart} color="#f43f5e" />
        <MetricCard metric={displayData.spo2} icon={Zap} color="#38bdf8" />
        <ScoreCard data={displayData.stress} icon={Brain} />
        <MetricCard metric={displayData.temperature} icon={Thermometer} color="#f97316" />
        
        <HrvChart data={displayData.hrv} />
        
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ScoreCard data={displayData.motion} icon={Activity} />
            <DeviceStatus statuses={displayData.deviceStatus} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

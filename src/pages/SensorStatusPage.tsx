import React from 'react';
import { Card } from '../components/ui/Card';
import { useNeuraBand } from '../contexts/NeuraBandContext';
import { DetailedStatus } from '../types/neuraband';
import { CheckCircle2, AlertTriangle, XCircle, Heart, BrainCircuit, PersonStanding, Thermometer, Zap } from 'lucide-react';

const statusConfig = {
  ok: { icon: CheckCircle2, color: 'text-green-500', text: 'Normal' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', text: 'Warning' },
  error: { icon: XCircle, color: 'text-red-500', text: 'Error' },
};

const sensorIcons: { [key: string]: React.ElementType } = {
  ecg: Heart,
  ppg: BrainCircuit,
  imu: PersonStanding,
  gsr: Zap,
  temp: Thermometer,
};

const DiagnosticCard: React.FC<{ sensor: DetailedStatus }> = ({ sensor }) => {
  const config = statusConfig[sensor.status];
  const Icon = sensorIcons[sensor.id];

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Icon className="h-6 w-6 text-muted-foreground mr-3" />
          <h3 className="text-lg font-semibold text-foreground">{sensor.name}</h3>
        </div>
        <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${config.color} bg-opacity-10 bg-current`}>
          <config.icon className="h-4 w-4 mr-1.5" />
          <span>{config.text}</span>
        </div>
      </div>
      <p className="mt-2 text-muted-foreground">{sensor.details}</p>
      <div className="mt-4 border-t border-muted pt-4 grid grid-cols-2 gap-4 text-sm">
        {sensor.sqi !== undefined && (
          <div>
            <dt className="text-muted-foreground font-medium">Signal Quality (SQI)</dt>
            <dd className="text-foreground mt-1">{sensor.sqi}%</dd>
          </div>
        )}
        {sensor.leadOff && (
          <div>
            <dt className="text-muted-foreground font-medium">Lead-off Detection</dt>
            <dd className={`mt-1 font-semibold ${sensor.leadOff === 'Connected' ? 'text-green-400' : 'text-red-400'}`}>{sensor.leadOff}</dd>
          </div>
        )}
        {sensor.calibration && (
          <div>
            <dt className="text-muted-foreground font-medium">Calibration</dt>
            <dd className="text-foreground mt-1">{sensor.calibration}</dd>
          </div>
        )}
      </div>
    </Card>
  );
};

const SensorStatusPage: React.FC = () => {
  const { data, connectionStatus } = useNeuraBand();
  const statusData = data?.detailedStatus;

  if (connectionStatus === 'connecting') {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Connecting to NeuraBand...</div>;
  }

  if (!statusData) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Waiting for sensor status...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statusData.map(sensor => (
          <DiagnosticCard key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
};

export default SensorStatusPage;

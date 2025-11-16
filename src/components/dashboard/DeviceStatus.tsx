import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, AlertTriangle, Battery, Heart, BrainCircuit, PersonStanding } from 'lucide-react';
import type { DeviceStatus as DeviceStatusType } from '../../types/neuraband';

const statusConfig = {
  ok: { icon: CheckCircle2, color: 'text-green-500', text: 'Normal' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', text: 'Warning' },
  error: { icon: AlertTriangle, color: 'text-red-500', text: 'Error' },
};

const deviceIcons = {
  Battery: Battery,
  ECG: Heart,
  PPG: BrainCircuit,
  IMU: PersonStanding,
};

interface DeviceStatusProps {
  statuses: DeviceStatusType[];
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ statuses }) => {
  const allOk = statuses.every(s => s.status === 'ok');

  return (
    <Card>
      <h3 className="text-lg font-semibold">Device Status</h3>
      <div className="mt-4 flex items-center">
        {allOk ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        )}
        <p className="ml-2 text-sm font-medium">{allOk ? 'All systems normal' : 'Attention needed'}</p>
      </div>
      <div className="mt-4 space-y-3">
        {statuses.map((device) => {
          const config = statusConfig[device.status];
          const DeviceIcon = deviceIcons[device.name];
          return (
            <div key={device.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <DeviceIcon className="h-5 w-5 text-muted-foreground mr-3" />
                <span>{device.name}</span>
              </div>
              <div className="flex items-center">
                <config.icon className={`h-4 w-4 mr-2 ${config.color}`} />
                <span className={config.color}>{config.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DeviceStatus;

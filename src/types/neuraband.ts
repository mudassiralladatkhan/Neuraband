export interface Metric {
  value: string | number;
  unit: string;
  label: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  sparkline: number[];
}

export interface StressMetric {
  level: 'Low' | 'Moderate' | 'High';
  score: number;
  label: string;
}

export interface MotionMetric {
  level: 'Low' | 'Moderate' | 'High';
  score: number;
  label: string;
}

export interface DeviceStatus {
  name: 'Battery' | 'ECG' | 'PPG' | 'IMU';
  status: 'ok' | 'warning' | 'error';
}

export interface HrvData {
  timestamps: string[];
  values: number[];
}

// New types for detailed pages
export interface SignalStream {
  ecg: number[];
  ppg: number[];
  imu: { x: number[], y: number[], z: number[] };
}

export interface DetailedStatus {
  id: 'ecg' | 'ppg' | 'imu' | 'gsr' | 'temp';
  name: string;
  status: 'ok' | 'warning' | 'error';
  sqi?: number;
  leadOff?: 'Connected' | 'Disconnected';
  calibration?: string;
  details: string;
}

export interface DeviceSettingsConfig {
  samplingRates: {
    ecg: number;
    ppg: number;
    imu: number;
    gsr: number;
  };
  model: 'neuraband_B_float16.tflite' | 'neuraband_B_int8.tflite';
}

export interface DataLogFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  modified: string;
  path: string;
}

// Main data structure
export interface NeuraBandData {
  heartRate: Metric;
  spo2: Metric;
  temperature: Metric;
  stress: StressMetric;
  motion: MotionMetric;
  deviceStatus: DeviceStatus[];
  hrv: HrvData;
  signals: SignalStream;
  detailedStatus: DetailedStatus[];
  settings: DeviceSettingsConfig;
  logs: DataLogFile[];
}

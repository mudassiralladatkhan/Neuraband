import { faker } from '@faker-js/faker';
import type { NeuraBandData, DataLogFile } from '../types/neuraband';

const generateSparkline = () => Array.from({ length: 20 }, () => faker.number.int({ min: 60, max: 100 }));

// --- Real-time Signal Generators ---
let ecgBase = 0;
const generateEcgPoint = () => {
    const noise = (Math.random() - 0.5) * 0.1;
    const peak = Math.sin(ecgBase * 25) > 0.95 ? Math.random() * 2 + 1 : 0; // R-peak
    const wave = Math.sin(ecgBase * 2) * 0.5 + Math.sin(ecgBase) * 0.2;
    ecgBase += 0.1;
    return parseFloat((wave + peak + noise).toFixed(3));
};

let ppgBase = 0;
const generatePpgPoint = () => {
    const noise = (Math.random() - 0.5) * 0.05;
    const wave = Math.sin(ppgBase) * Math.sin(ppgBase / 20);
    ppgBase += 0.1;
    return parseFloat((wave + noise).toFixed(3));
};

const generateImuPoint = () => ({
    x: parseFloat((Math.sin(Date.now() / 1000) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(3)),
    y: parseFloat((Math.cos(Date.now() / 1000) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(3)),
    z: parseFloat((Math.sin(Date.now() / 1500) * 0.3 + (Math.random() - 0.5) * 0.1).toFixed(3)),
});

export const generateNewSignalData = () => ({
    ecg: generateEcgPoint(),
    ppg: generatePpgPoint(),
    imu: generateImuPoint(),
});


// --- Static Data Generators ---
const generateLogFiles = (): DataLogFile[] => [
    { id: '1', name: 'models', type: 'folder', size: '4.1 MB', modified: faker.date.recent().toLocaleDateString(), path: '/' },
    { id: '2', name: 'data', type: 'folder', size: '128.3 MB', modified: faker.date.recent().toLocaleDateString(), path: '/' },
    { id: '3', name: 'logs', type: 'folder', size: '2.5 MB', modified: faker.date.recent().toLocaleDateString(), path: '/' },
    { id: '4', name: 'config.json', type: 'file', size: '1 KB', modified: faker.date.recent().toLocaleDateString(), path: '/' },
    { id: '5', name: 'features_2025-07-21.csv', type: 'file', size: '12.7 MB', modified: '2025-07-21', path: '/data/' },
    { id: '6', name: 'raw_2025-07-21_ecg.bin', type: 'file', size: '45.1 MB', modified: '2025-07-21', path: '/data/' },
    { id: '7', name: 'debug.log', type: 'file', size: '512 KB', modified: faker.date.recent().toLocaleDateString(), path: '/logs/' },
];

// --- Main Data Generation Function ---
export const generateMockData = (): NeuraBandData => {
  const stressScore = faker.number.int({ min: 10, max: 90 });
  const motionScore = faker.number.int({ min: 5, max: 95 });

  return {
    heartRate: {
      value: faker.number.int({ min: 65, max: 85 }),
      unit: 'BPM',
      label: 'Heart Rate',
      change: `${faker.number.float({ min: 0.1, max: 2.5, precision: 0.1 })}%`,
      changeType: faker.helpers.arrayElement(['increase', 'decrease']),
      sparkline: generateSparkline(),
    },
    spo2: {
      value: faker.number.int({ min: 96, max: 99 }),
      unit: '%',
      label: 'SpO2',
      change: `${faker.number.float({ min: 0.1, max: 1.0, precision: 0.1 })}%`,
      changeType: faker.helpers.arrayElement(['increase', 'decrease']),
      sparkline: Array.from({ length: 20 }, () => faker.number.int({ min: 95, max: 99 })),
    },
    stress: {
      score: stressScore,
      level: stressScore < 40 ? 'Low' : stressScore < 70 ? 'Moderate' : 'High',
      label: 'Stress Level',
    },
    temperature: {
        value: faker.number.float({ min: 36.5, max: 37.2, precision: 0.1 }),
        unit: '°C',
        label: 'Body Temperature',
        change: `${faker.number.float({ min: 0.1, max: 0.5, precision: 0.1 })}%`,
        changeType: faker.helpers.arrayElement(['increase', 'decrease']),
        sparkline: Array.from({ length: 20 }, () => faker.number.float({ min: 36.5, max: 37.2, precision: 0.1 })),
    },
    motion: {
        score: motionScore,
        level: motionScore < 30 ? 'Low' : motionScore < 75 ? 'Moderate' : 'High',
        label: 'Motion Activity',
    },
    deviceStatus: [
      { name: 'Battery', status: 'ok' },
      { name: 'ECG', status: 'ok' },
      { name: 'PPG', status: 'ok' },
      { name: 'IMU', status: 'warning' },
    ],
    hrv: {
        timestamps: Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, '0')}:00`),
        values: Array.from({ length: 12 }, () => faker.number.int({ min: 40, max: 70 })),
    },
    signals: {
      ecg: Array.from({ length: 200 }, generateEcgPoint),
      ppg: Array.from({ length: 200 }, generatePpgPoint),
      imu: {
          x: Array.from({ length: 200 }, () => generateImuPoint().x),
          y: Array.from({ length: 200 }, () => generateImuPoint().y),
          z: Array.from({ length: 200 }, () => generateImuPoint().z),
      }
    },
    detailedStatus: [
        { id: 'ecg', name: 'ECG Sensor (AD8232)', status: 'ok', sqi: 94, leadOff: 'Connected', details: 'Signal quality is excellent. R-peaks are clearly distinguishable.' },
        { id: 'ppg', name: 'PPG Sensor (MAX30102)', status: 'ok', sqi: 91, details: 'IR and RED channels are stable. SpO2 calculation is reliable.' },
        { id: 'imu', name: 'IMU (MPU6050)', status: 'warning', sqi: 78, details: 'Minor motion artifacts detected. Gyroscope drift within acceptable limits.' },
        { id: 'gsr', name: 'GSR Sensor', status: 'ok', details: 'Tonic and phasic responses are being measured correctly.' },
        { id: 'temp', name: 'Temperature (LM35)', status: 'ok', calibration: 'Calibrated on 2025-07-20', details: 'Sensor is reporting stable body temperature.' },
    ],
    settings: {
        samplingRates: { ecg: 250, ppg: 100, imu: 100, gsr: 25 },
        model: 'neuraband_B_float16.tflite'
    },
    logs: generateLogFiles(),
  };
};

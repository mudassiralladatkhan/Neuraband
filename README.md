<div align="center">

# 🧠 Neuraband

### Real-Time Wearable Health Monitoring Dashboard with Edge AI

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![ECharts](https://img.shields.io/badge/ECharts-Visualization-AA344D?style=for-the-badge)](https://echarts.apache.org)

<br/>

**Monitor ECG, PPG, IMU, GSR, and temperature signals in real-time with AI-powered stress detection and health analytics from a wearable biosensor band.**

[Features](#-features) · [Signals](#-sensor-signals) · [Architecture](#-architecture) · [Setup](#-quick-start)

---

</div>

## 🎯 What is Neuraband?

Neuraband is the companion web dashboard for a custom wearable health monitoring device. It provides:

- 📡 **Real-time signal streaming** — ECG, PPG, IMU (accelerometer/gyro), GSR, temperature
- 🧠 **Edge AI inference** — on-device TFLite model for stress/activity classification
- 📊 **Health analytics** — heart rate, SpO2, HRV, stress levels, motion detection
- ⚙️ **Device configuration** — sampling rates, model selection, calibration
- 📁 **Data logging** — exportable sensor recordings for research

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💓 **Heart Rate** | Real-time BPM with trend sparklines and change detection |
| 🫁 **SpO2** | Blood oxygen saturation from PPG sensor |
| 🌡️ **Temperature** | Continuous body temperature monitoring |
| 😰 **Stress Detection** | AI-classified stress level (Low/Moderate/High) with score |
| 🏃 **Motion Tracking** | IMU-based activity detection and motion classification |
| 📈 **Real-Time Signals** | Live ECG, PPG, IMU waveforms with interactive ECharts |
| 🔋 **Device Status** | Battery, sensor health, lead-off detection, SQI monitoring |
| ⚙️ **Settings** | Configurable sampling rates (ECG/PPG/IMU/GSR) and AI model selection |
| 📁 **Data Logs** | Browse, download, and manage recorded sensor data files |
| 🔐 **Auth** | User authentication with role-based access via Supabase |

---

## 📡 Sensor Signals

| Sensor | Data | Sample Rate | Use Case |
|--------|------|-------------|----------|
| **ECG** | Electrical heart activity | Configurable | Heart rhythm, arrhythmia detection |
| **PPG** | Photoplethysmography | Configurable | SpO2, heart rate |
| **IMU** | Accelerometer + Gyroscope (3-axis) | Configurable | Activity, fall detection |
| **GSR** | Galvanic skin response | Configurable | Stress, emotional arousal |
| **Temp** | Skin temperature | Continuous | Fever, circadian rhythm |

---

## 🧠 AI Model

```
Model:     neuraband_B_float16.tflite (or int8 quantized variant)
Runtime:   TensorFlow Lite on-device
Input:     Multi-modal sensor fusion (ECG + PPG + IMU + GSR)
Output:    Stress classification, activity type, anomaly flags
Latency:   <50ms inference on edge hardware
```

---

## 🛠 Tech Stack

```
Frontend:       React 19 + TypeScript 5.8 + Vite 6
Visualization:  ECharts (via echarts-for-react) — real-time signal rendering
Styling:        Tailwind CSS + Lucide icons
Backend:        Supabase (Auth, PostgreSQL, Realtime subscriptions)
State:          React Context (Auth + NeuraBand data)
Data:           WebSocket mock (development) / BLE bridge (production)
Routing:        React Router DOM v6
```

---

## 🏗️ Architecture

```
src/
├── pages/
│   ├── Dashboard.tsx         # Main vitals overview (HR, SpO2, Temp, Stress)
│   ├── RealTimeSignals.tsx   # Live ECG/PPG/IMU waveforms
│   ├── SensorStatusPage.tsx  # Detailed sensor health & SQI
│   ├── DeviceSettings.tsx    # Sampling rates & model config
│   ├── DataLogs.tsx          # Recorded data file browser
│   ├── LoginPage.tsx         # Authentication
│   └── SignUpPage.tsx        # Registration
├── contexts/
│   ├── AuthContext.tsx       # User authentication state
│   └── NeuraBandContext.tsx  # Device data & WebSocket state
├── types/
│   ├── neuraband.ts          # Metric, Signal, Device interfaces
│   └── database.types.ts     # Supabase schema types
├── lib/
│   ├── mockData.ts           # Development data generator
│   ├── mockWebSocket.ts      # Simulated real-time stream
│   └── supabaseClient.ts     # Database client
└── supabase/
    └── migrations/           # Database schema & RLS policies
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/mudassiralladatkhan/Neuraband.git
cd Neuraband

# Install dependencies
yarn install

# Configure Supabase
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env

# Run development server (uses mock WebSocket data)
yarn dev
```

---

## 📊 Dashboard Views

| View | What it Shows |
|------|--------------|
| **Dashboard** | Heart rate, SpO2, temperature, stress, motion — all at a glance with sparkline trends |
| **Real-Time Signals** | Live scrolling ECG/PPG/IMU waveforms (ECharts canvas rendering) |
| **Sensor Status** | Per-sensor health check: lead-off, SQI score, calibration state |
| **Device Settings** | Adjust sampling rates, select AI model (float16 vs int8) |
| **Data Logs** | Browse recorded sessions, file sizes, timestamps, download/delete |

---

## 🔬 Technical Highlights

- **Signal Quality Index (SQI)** — automatic assessment of sensor data quality
- **Lead-off detection** — real-time electrode contact monitoring for ECG
- **Adaptive sampling** — configurable rates based on power/accuracy trade-off
- **Dual model support** — float16 (accuracy) vs int8 (speed/battery) selection
- **Role-based access** — `get_user_role()` Postgres function with hardened search path

---

<div align="center">

**Built with 🧠 by [Mudassir Alladatkhan](https://github.com/mudassiralladatkhan)**

*Your health, quantified. AI on your wrist.*

</div>

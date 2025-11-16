import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { NeuraBandData, DeviceSettingsConfig } from '../types/neuraband';
import { Database } from '../types/database.types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { initializeMockWebSocket } from '../lib/mockWebSocket';

type Device = Database['public']['Tables']['devices']['Row'];

interface NeuraBandContextType {
  data: NeuraBandData | null;
  connectionStatus: 'connecting' | 'open' | 'closed';
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  updateSettings: (newSettings: DeviceSettingsConfig) => void;
  devices: Device[];
  activeDevice: Device | null;
  setActiveDevice: (device: Device | null) => void;
  refreshDevices: () => void;
  loading: boolean; // Added for initial data loading
}

const NeuraBandContext = createContext<NeuraBandContextType | undefined>(undefined);

interface NeuraBandProviderProps {
  children: ReactNode;
  wsUrl?: string;
}

export const NeuraBandProvider: React.FC<NeuraBandProviderProps> = ({ children, wsUrl = 'ws://localhost:8080' }) => {
  const { user } = useAuth();
  const [data, setData] = useState<NeuraBandData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const [isPlaying, setIsPlaying] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [devices, setDevices] = useState<Device[]>([]);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // New loading state for initial context setup

  const refreshDevices = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: userDevices, error } = await supabase.from('devices').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching devices:', error);
    } else {
      setDevices(userDevices);
      setActiveDevice(currentActive => {
        if (currentActive && userDevices.some(d => d.id === currentActive.id)) {
          return currentActive;
        }
        return userDevices.length > 0 ? userDevices[0] : null;
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  useEffect(() => {
    if (!user || !activeDevice) {
      setConnectionStatus('closed');
      return;
    };

    let cleanupMockWs: () => void;
    if (import.meta.env.DEV) {
      cleanupMockWs = initializeMockWebSocket(wsUrl);
    }
    
    const ws = new WebSocket(wsUrl);
    setSocket(ws);
    setConnectionStatus('connecting');

    ws.onopen = async () => {
      console.log('WebSocket connection established');
      setConnectionStatus('open');
      const { data: sessionData, error } = await supabase
        .from('sessions')
        .insert({ user_id: user.id, device_id: activeDevice.id })
        .select()
        .single();
      
      if (error) console.error("Failed to create session:", error);
      else setActiveSessionId(sessionData.id);
    };

    ws.onmessage = async (event) => {
      if (isPlaying && activeSessionId) {
        try {
          const incomingData: NeuraBandData = JSON.parse(event.data);
          setData(incomingData);

          const payload: Database['public']['Tables']['biosignals']['Insert'] = {
            session_id: activeSessionId,
            user_id: user.id,
            timestamp: new Date().toISOString(),
            heart_rate: incomingData.heartRate.value as number,
            spo2: incomingData.spo2.value as number,
            temperature: incomingData.temperature.value as number,
            stress_score: incomingData.stress.score,
            motion_score: incomingData.motion.score,
            hrv: incomingData.hrv.values[incomingData.hrv.values.length - 1],
          };

          const { error } = await supabase.from('biosignals').insert(payload);
          if (error) console.error('Error inserting biosignal data:', error);

        } catch (error) {
          console.error('Failed to parse or insert WebSocket data:', error);
        }
      }
    };

    ws.onclose = async () => {
      console.log('WebSocket connection closed');
      setConnectionStatus('closed');
      if (activeSessionId) {
        await supabase.from('sessions').update({ end_time: new Date().toISOString() }).eq('id', activeSessionId);
        setActiveSessionId(null);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('closed');
    };

    return () => {
      if (cleanupMockWs) cleanupMockWs();
      ws.close();
    };
  }, [user, activeDevice, wsUrl, isPlaying]);

  const updateSettings = useCallback(async (newSettings: DeviceSettingsConfig) => {
    if (activeDevice) {
      const { error } = await supabase
        .from('devices')
        .update({ settings: newSettings as any })
        .eq('id', activeDevice.id);
      
      if (error) {
        console.error("Failed to update settings in DB:", error);
      } else {
        const updatedDevice = { ...activeDevice, settings: newSettings as any };
        setActiveDevice(updatedDevice);
        setDevices(devices.map(d => d.id === updatedDevice.id ? updatedDevice : d));
      }
    }
  }, [socket, activeDevice, devices]);

  const value = { data, connectionStatus, isPlaying, setIsPlaying, updateSettings, devices, activeDevice, setActiveDevice, refreshDevices, loading };

  return (
    <NeuraBandContext.Provider value={value}>
      {children}
    </NeuraBandContext.Provider>
  );
};

export const useNeuraBand = (): NeuraBandContextType => {
  const context = useContext(NeuraBandContext);
  if (context === undefined) {
    throw new Error('useNeuraBand must be used within a NeuraBandProvider');
  }
  return context;
};

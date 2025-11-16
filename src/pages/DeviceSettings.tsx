import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { useNeuraBand } from '../contexts/NeuraBandContext';
import { DeviceSettingsConfig } from '../types/neuraband';
import { Save, PlusCircle } from 'lucide-react';
import AddDeviceModal from '../components/settings/AddDeviceModal';
import { Skeleton } from '../components/ui/Skeleton';

const DeviceSettings: React.FC = () => {
  const { devices, activeDevice, setActiveDevice, refreshDevices, updateSettings, loading } = useNeuraBand();
  const [settings, setSettings] = useState<DeviceSettingsConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (activeDevice?.settings) {
      setSettings(activeDevice.settings as DeviceSettingsConfig);
    } else {
      // Provide default settings if none exist
      setSettings({
        samplingRates: { ecg: 250, ppg: 100, imu: 100, gsr: 25 },
        model: 'neuraband_B_float16.tflite'
      });
    }
  }, [activeDevice]);

  const handleSave = async () => {
    if (!settings || !activeDevice) return;
    setIsSaving(true);
    await updateSettings(settings);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;
    const newActiveDevice = devices.find(d => d.id === deviceId);
    if (newActiveDevice) {
      setActiveDevice(newActiveDevice);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {isModalOpen && <AddDeviceModal onClose={() => setIsModalOpen(false)} onDeviceAdded={refreshDevices} />}
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Device Configuration</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none"
            >
              <PlusCircle className="-ml-0.5 mr-2 h-4 w-4" />
              Add New Device
            </button>
          </div>

          {devices.length > 0 && settings ? (
            <div className="space-y-8">
              <div>
                <label htmlFor="activeDevice" className="block text-sm font-medium text-muted-foreground">Active Device</label>
                <select
                  id="activeDevice"
                  name="activeDevice"
                  value={activeDevice?.id || ''}
                  onChange={handleDeviceChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-muted border-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Sensor Sampling Rates (Hz)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(settings.samplingRates).map(([key, value]) => (
                    <div key={key}>
                      <label htmlFor={`samplingRates.${key}`} className="block text-sm font-medium text-muted-foreground uppercase">{key}</label>
                      <select
                        id={`samplingRates.${key}`}
                        name={`samplingRates.${key}`}
                        value={value}
                        onChange={(e) => setSettings(s => s ? { ...s, samplingRates: { ...s.samplingRates, [key]: Number(e.target.value) } } : null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-muted border-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      >
                        {[25, 50, 100, 250, 500].map(rate => <option key={rate} value={rate}>{rate} Hz</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">TinyML Model Selection</h3>
                <fieldset className="space-y-4">
                  <div className="flex items-center">
                    <input id="float16" name="model" type="radio" value="neuraband_B_float16.tflite" checked={settings.model === 'neuraband_B_float16.tflite'} onChange={(e) => setSettings(s => s ? { ...s, model: e.target.value as any } : null)} className="h-4 w-4 text-primary bg-muted border-muted focus:ring-primary" />
                    <label htmlFor="float16" className="ml-3 block text-sm font-medium text-foreground">Float16 Model <span className="text-muted-foreground">(Balanced)</span></label>
                  </div>
                  <div className="flex items-center">
                    <input id="int8" name="model" type="radio" value="neuraband_B_int8.tflite" checked={settings.model === 'neuraband_B_int8.tflite'} onChange={(e) => setSettings(s => s ? { ...s, model: e.target.value as any } : null)} className="h-4 w-4 text-primary bg-muted border-muted focus:ring-primary" />
                    <label htmlFor="int8" className="ml-3 block text-sm font-medium text-foreground">Int8 Model <span className="text-muted-foreground">(High Performance)</span></label>
                  </div>
                </fieldset>
              </div>

              <div className="mt-8 pt-5 border-t border-muted">
                <div className="flex justify-end items-center">
                  {showSuccess && <span className="text-green-400 text-sm mr-4">Settings saved!</span>}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    <Save className={`-ml-1 mr-2 h-5 w-5 ${isSaving ? 'animate-spin' : ''}`} />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center py-10">
                <p className="text-muted-foreground">No devices found.</p>
                <p className="text-sm text-muted-foreground mt-2">Click "Add New Device" to get started.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DeviceSettings;

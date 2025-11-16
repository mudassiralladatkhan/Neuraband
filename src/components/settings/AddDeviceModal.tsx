import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { X, Save } from 'lucide-react';

interface AddDeviceModalProps {
  onClose: () => void;
  onDeviceAdded: () => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ onClose, onDeviceAdded }) => {
  const { user } = useAuth();
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !deviceName) return;

    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('devices')
      .insert({ user_id: user.id, name: deviceName });

    if (insertError) {
      setError(insertError.message);
    } else {
      onDeviceAdded();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-muted/80 backdrop-blur-sm rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Add New Device</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-accent">
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-muted-foreground">
                Device Name
              </label>
              <input
                type="text"
                id="deviceName"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g., My Primary NeuraBand"
                className="mt-1 block w-full px-3 py-2 border border-muted rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-medium rounded-md hover:bg-accent">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              <Save className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Saving...' : 'Save Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;

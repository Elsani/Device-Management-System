import React, { useState, useEffect } from 'react';
import { Device, Category } from '../types';
import { CustomDropdown } from './CustomDropdown';
import { X, Laptop, Smartphone, Monitor, HardDrive } from 'lucide-react';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deviceData: { serialNumber: string; name: string; category: Category; purchaseDate: string }) => Promise<void>;
  initialDevice?: Device | null;
}

export const DeviceModal: React.FC<DeviceModalProps> = ({ isOpen, onClose, onSubmit, initialDevice }) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('LAPTOP');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialDevice) {
      setSerialNumber(initialDevice.serialNumber);
      setName(initialDevice.name);
      setCategory(initialDevice.category);
      setPurchaseDate(initialDevice.purchaseDate || '');
    } else {
      setSerialNumber('');
      setName('');
      setCategory('LAPTOP');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }, [initialDevice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ serialNumber, name, category, purchaseDate });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ndodhi një gabim gjatë ruajtjes së pajisjes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Laptop className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-base">
              {initialDevice ? 'Ndrysho Pajisjen' : 'Regjistro Pajisje të Re'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Numri Serial (Unik) *
            </label>
            <input
              type="text"
              required
              placeholder="p.sh. MBP-2024-042"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Emri / Modeli i Pajisjes *
            </label>
            <input
              type="text"
              required
              placeholder="p.sh. MacBook Pro 16 M3 Max"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategoria *
              </label>
              <CustomDropdown<Category>
                value={category}
                onChange={(val) => { if (val) setCategory(val as Category); }}
                placeholder="Zgjidh Kategorinë"
                options={[
                  { label: 'Laptop', value: 'LAPTOP', icon: <span className="text-base">💻</span> },
                  { label: 'Phone', value: 'PHONE', icon: <span className="text-base">📱</span> },
                  { label: 'Monitor', value: 'MONITOR', icon: <span className="text-base">🖥️</span> },
                  { label: 'Accessory', value: 'ACCESSORY', icon: <span className="text-base">🔌</span> },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data e Blerjes
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Anulo
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Duke ruajtur...' : initialDevice ? 'Përditëso' : 'Ruaj Pajisjen'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Device, User } from '../types';
import { CustomDropdown } from './CustomDropdown';
import api from '../services/api';
import { X, UserCheck, RotateCcw } from 'lucide-react';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSuccess: () => void;
}

export const AssignModal: React.FC<AssignModalProps> = ({ isOpen, onClose, device, onSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAssigned = device?.status === 'ASSIGNED';

  useEffect(() => {
    if (isOpen && !isAssigned) {
      // Merr listën e përdoruesve për dropdown
      api.get<User[]>('/users')
        .then((res) => setUsers(res.data))
        .catch(() => setError('Nuk u arrit të ngarkohen punëtorët'));
    }
    setSelectedUserId('');
    setNotes('');
    setError('');
  }, [isOpen, isAssigned]);

  if (!isOpen || !device) return null;

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Zgjidh një punëtor');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post(`/devices/${device.id}/assign`, {
        userId: Number(selectedUserId),
        notes,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ndodhi një gabim gjatë caktimit');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post(`/devices/${device.id}/return`, { notes });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ndodhi një gabim gjatë kthimit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center text-white ${isAssigned ? 'bg-amber-700' : 'bg-blue-700'}`}>
          <div className="flex items-center gap-2.5">
            <div className="bg-white/20 p-2 rounded-lg">
              {isAssigned ? <RotateCcw className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-base">
                {isAssigned ? 'Kthe Pajisjen në Magazinë' : 'Cakto Pajisjen te Punëtori'}
              </h3>
              <p className="text-xs text-white/80">{device.name} ({device.serialNumber})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={isAssigned ? handleReturn : handleAssign} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          {isAssigned ? (
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
              <p className="font-semibold">Aktualisht i caktuar te:</p>
              <p className="text-sm font-bold text-amber-950">{device.assignedTo?.fullName}</p>
              <p className="text-slate-500">{device.assignedTo?.email}</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Zgjidh Punëtorin *
              </label>
                <CustomDropdown<string>
                  value={selectedUserId ? String(selectedUserId) : ''}
                  onChange={(val) => setSelectedUserId(val ? Number(val) : '')}
                  placeholder="-- Zgjidh punëtorin nga lista --"
                  options={[
                    { label: '-- Zgjidh punëtorin nga lista --', value: '' },
                    ...users.map((u) => {
                      const uid = u.id || (u as any).userId;
                      return {
                        label: `${u.fullName} (${u.email})`,
                        value: String(uid),
                        icon: <span className="text-xs">👤</span>,
                      };
                    }),
                  ]}
                />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shënime {isAssigned ? 'mbi gjendjen e kthimit' : 'mbi pranim-dorëzimin'}
            </label>
            <textarea
              rows={3}
              placeholder={isAssigned ? "p.sh. Kthyer me karikues, gjendje perfekte" : "p.sh. Dhënë me karikues dhe maus"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 ${
                isAssigned ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Duke procesuar...' : isAssigned ? 'Konfirmo Kthimin' : 'Konfirmo Caktimin'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

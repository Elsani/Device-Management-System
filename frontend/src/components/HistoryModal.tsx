import React, { useState, useEffect } from 'react';
import { Device, AssignmentHistory } from '../types';
import api from '../services/api';
import { X, History, Clock, ArrowRight, User } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, device }) => {
  const [history, setHistory] = useState<AssignmentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && device) {
      setLoading(true);
      setError('');
      api.get<AssignmentHistory[]>(`/devices/${device.id}/history`)
        .then((res) => setHistory(res.data))
        .catch(() => setError('Nuk u arrit të ngarkohet historiku'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, device]);

  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Historiku i Lëvizjeve (Audit Trail)</h3>
              <p className="text-xs text-slate-400">{device.name} • {device.serialNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-sm text-slate-500">Duke ngarkuar historikun...</div>
          ) : error ? (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Kjo pajisje nuk ka ende asnjë historik caktimi.
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
              {history.map((item, idx) => (
                <div key={item.id} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    idx === 0 && !item.returnedAt ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-400'
                  }`} />

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{item.userFullName}</p>
                          <p className="text-[11px] text-slate-500">{item.userEmail}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        !item.returnedAt ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {!item.returnedAt ? '🟢 Aktiv Aktualisht' : '✓ Kthyer'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 pt-1 border-t border-slate-200/60 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(item.assignedAt).toLocaleString('sq-AL', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>
                        {item.returnedAt
                          ? new Date(item.returnedAt).toLocaleString('sq-AL', { dateStyle: 'medium', timeStyle: 'short' })
                          : 'Në Përdorim'}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Mbyll
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AuthResponse } from '../types';
import { Laptop, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { fullName, email, password, role } : { email, password };
      
      const response = await api.post<AuthResponse>(endpoint, payload);
      login(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Ndodhi një gabim gjatë autentikimit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
          <Laptop className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          DeviceHub Management
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {isRegister ? 'Krijo llogari të re në platformë' : 'Hyr në sistemin tënd të menaxhimit të IT-së'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800">
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Emri dhe Mbiemri *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="p.sh. Elsan Memeti"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-800/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Roli në Kompani *
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'ADMIN' | 'EMPLOYEE')}
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-800/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ADMIN">👑 IT Administrator (Qasje e plotë)</option>
                      <option value="EMPLOYEE">👤 Employee (Punëtor)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Adresa Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@devicemanagement.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-800/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Fjalëkalimi *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-800/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/30 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Duke procesuar...' : isRegister ? 'Regjistrohu' : 'Kyçu në Sistem'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              {isRegister ? 'Ke tashmë llogari? Kyçu këtu' : 'Nuk ke llogari? Regjistrohu këtu'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Device, Category, DeviceStatus } from '../types';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { DeviceModal } from '../components/DeviceModal';
import { AssignModal } from '../components/AssignModal';
import { HistoryModal } from '../components/HistoryModal';
import { CustomDropdown } from '../components/CustomDropdown';
import {
  Laptop,
  Smartphone,
  Monitor,
  HardDrive,
  Plus,
  Search,
  Filter,
  UserCheck,
  RotateCcw,
  History,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<DeviceStatus | ''>('');

  // Modals state
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDeviceForAssign, setSelectedDeviceForAssign] = useState<Device | null>(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedDeviceForHistory, setSelectedDeviceForHistory] = useState<Device | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;

      const res = await api.get<Device[]>('/devices', { params });
      setDevices(res.data);
    } catch (err) {
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [selectedCategory, selectedStatus]);

  const handleSaveDevice = async (deviceData: any) => {
    if (editingDevice) {
      await api.put(`/devices/${editingDevice.id}`, deviceData);
    } else {
      await api.post('/devices', deviceData);
    }
    fetchDevices();
  };

  const handleDeleteDevice = async (id: number) => {
    if (window.confirm('A jeni i sigurt që dëshironi ta fshini këtë pajisje?')) {
      try {
        await api.delete(`/devices/${id}`);
        fetchDevices();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Nuk mund të fshihet pajisja');
      }
    }
  };

  const filteredDevices = devices.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.assignedTo && d.assignedTo.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistics
  const totalCount = devices.length;
  const availableCount = devices.filter((d) => d.status === 'AVAILABLE').length;
  const assignedCount = devices.filter((d) => d.status === 'ASSIGNED').length;
  const maintenanceCount = devices.filter((d) => d.status === 'MAINTENANCE').length;

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'LAPTOP': return <Laptop className="w-4 h-4 text-blue-500" />;
      case 'PHONE': return <Smartphone className="w-4 h-4 text-emerald-500" />;
      case 'MONITOR': return <Monitor className="w-4 h-4 text-purple-500" />;
      case 'ACCESSORY': return <HardDrive className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> E Lirë (Available)
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
            <Clock className="w-3 h-3" /> E Caktuar (Assigned)
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Në Servis
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Top Header & Quick Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Menaxhimi i Pajisjeve të IT-së
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Inventari i pajisjeve, caktimi te punëtorët dhe ditari i historikut
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingDevice(null);
                setIsDeviceModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Pajisje të Re</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Totali i Pajisjeve</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Laptop className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Të Lira (Available)</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{availableCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Të Caktuara (In Use)</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{assignedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Në Mirëmbajtje</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{maintenanceCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Kërko me emër, serial, punëtor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtro:</span>
            </div>

            <CustomDropdown<Category>
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Të gjitha Kategoritë"
              options={[
                { label: 'Të gjitha Kategoritë', value: '' },
                { label: 'Laptop', value: 'LAPTOP', icon: <Laptop className="w-3.5 h-3.5 text-blue-500" /> },
                { label: 'Phone', value: 'PHONE', icon: <Smartphone className="w-3.5 h-3.5 text-emerald-500" /> },
                { label: 'Monitor', value: 'MONITOR', icon: <Monitor className="w-3.5 h-3.5 text-purple-500" /> },
                { label: 'Accessory', value: 'ACCESSORY', icon: <HardDrive className="w-3.5 h-3.5 text-amber-500" /> },
              ]}
            />

            <CustomDropdown<DeviceStatus>
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Të gjitha Statuset"
              options={[
                { label: 'Të gjitha Statuset', value: '' },
                { label: 'E Lirë (Available)', value: 'AVAILABLE', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
                { label: 'E Caktuar (Assigned)', value: 'ASSIGNED', icon: <Clock className="w-3.5 h-3.5 text-blue-500" /> },
                { label: 'Në Servis (Maintenance)', value: 'MAINTENANCE', icon: <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> },
              ]}
            />
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Duke ngarkuar listën e pajisjeve...
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Nuk u gjet asnjë pajisje me këto kritere kërkimi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Pajisja & Kategoria</th>
                    <th className="py-3 px-4">Numri Serial</th>
                    <th className="py-3 px-4">Statusi</th>
                    <th className="py-3 px-4">I Caktuar Te</th>
                    <th className="py-3 px-4">Data e Blerjes</th>
                    <th className="py-3 px-4 text-right">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {filteredDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Name & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            {getCategoryIcon(device.category)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{device.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{device.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Serial Number */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {device.serialNumber}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(device.status)}
                      </td>

                      {/* Assigned To */}
                      <td className="py-3.5 px-4">
                        {device.assignedTo ? (
                          <div>
                            <span className="font-bold text-slate-900 block">{device.assignedTo.fullName}</span>
                            <span className="text-[10px] text-slate-400">{device.assignedTo.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Në Magazinë</span>
                        )}
                      </td>

                      {/* Purchase Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {device.purchaseDate || '—'}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* History Log */}
                          <button
                            onClick={() => {
                              setSelectedDeviceForHistory(device);
                              setIsHistoryModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Shiko Historikun"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Admin Only Actions */}
                          {isAdmin && (
                            <>
                              {/* Assign / Return Button */}
                              {device.status === 'ASSIGNED' ? (
                                <button
                                  onClick={() => {
                                    setSelectedDeviceForAssign(device);
                                    setIsAssignModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg transition-colors"
                                  title="Kthe në magazinë"
                                >
                                  <RotateCcw className="w-3 h-3" /> Kthe
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedDeviceForAssign(device);
                                    setIsAssignModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-lg transition-colors"
                                  title="Cakto te punëtori"
                                >
                                  <UserCheck className="w-3 h-3" /> Cakto
                                </button>
                              )}

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setEditingDevice(device);
                                  setIsDeviceModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ndrysho"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteDevice(device.id)}
                                disabled={device.status === 'ASSIGNED'}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title={device.status === 'ASSIGNED' ? 'Nuk mund të fshihet sa kohë është e caktuar' : 'Fshi'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Modals */}
      <DeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onSubmit={handleSaveDevice}
        initialDevice={editingDevice}
      />

      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        device={selectedDeviceForAssign}
        onSuccess={fetchDevices}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        device={selectedDeviceForHistory}
      />

    </div>
  );
};

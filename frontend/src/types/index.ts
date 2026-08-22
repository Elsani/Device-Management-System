export type Role = 'ADMIN' | 'EMPLOYEE';

export type Category = 'LAPTOP' | 'PHONE' | 'MONITOR' | 'ACCESSORY';

export type DeviceStatus = 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface AssignedUser {
  id: number;
  fullName: string;
  email: string;
}

export interface Device {
  id: number;
  serialNumber: string;
  name: string;
  category: Category;
  status: DeviceStatus;
  purchaseDate: string;
  assignedTo: AssignedUser | null;
}

export interface AssignmentHistory {
  id: number;
  deviceId: number;
  deviceName: string;
  deviceSerialNumber: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  assignedAt: string;
  returnedAt: string | null;
  notes: string;
}

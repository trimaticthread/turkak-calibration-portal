
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  tbdsNo: string;
  certificateNo: string;
  customerId: string;
  customerName: string;
  deviceType: string;
  serialNumber: string;
  calibrationDate: string;
  validityDate: string;
  status: 'Draft' | 'Approved' | 'Expired';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Staff';
  phone: string;
  createdAt: string;
  isActive: boolean;
}

export interface DeviceType {
  id: string;
  name: string;
  description: string;
  category: string;
  specifications: string;
  createdAt: string;
}

export interface ReferenceDevice {
  id: string;
  name: string;
  deviceTypeId: string;
  deviceTypeName: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

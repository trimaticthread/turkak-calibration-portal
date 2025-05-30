
import apiClient from '@/config/api';
import { ApiResponse, PaginatedResponse, Certificate } from '@/types/api.types';

export const certificateService = {
  getAll: async (page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Certificate>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Certificate>>>('/certificates', {
      params: { page, pageSize, search }
    });
    return response.data.data;
  },

  getById: async (id: string): Promise<Certificate> => {
    const response = await apiClient.get<ApiResponse<Certificate>>(`/certificates/${id}`);
    return response.data.data;
  },

  create: async (certificate: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Certificate> => {
    const response = await apiClient.post<ApiResponse<Certificate>>('/certificates', certificate);
    return response.data.data;
  },

  update: async (id: string, certificate: Partial<Certificate>): Promise<Certificate> => {
    const response = await apiClient.put<ApiResponse<Certificate>>(`/certificates/${id}`, certificate);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/certificates/${id}`);
  },

  generateQR: async (id: string): Promise<{ qrImageUrl: string }> => {
    const response = await apiClient.post<ApiResponse<{ qrImageUrl: string }>>(`/certificates/${id}/qr`);
    return response.data.data;
  },

  downloadPdf: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/certificates/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

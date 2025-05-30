
import apiClient from '@/config/api';
import { ApiResponse, PaginatedResponse, Customer } from '@/types/api.types';

export const customerService = {
  getAll: async (page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Customer>>>('/customers', {
      params: { page, pageSize, search }
    });
    return response.data.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data.data;
  },

  create: async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
    const response = await apiClient.post<ApiResponse<Customer>>('/customers', customer);
    return response.data.data;
  },

  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, customer);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },

  getRecentTurkAk: async (): Promise<Customer[]> => {
    const response = await apiClient.get<ApiResponse<Customer[]>>('/customers/recent-turkak');
    return response.data.data;
  }
};

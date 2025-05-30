
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import { Customer } from '@/types/api.types';
import { toast } from 'sonner';

export const useCustomers = (page = 1, pageSize = 10, search = '') => {
  return useQuery({
    queryKey: ['customers', page, pageSize, search],
    queryFn: () => customerService.getAll(page, pageSize, search),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Müşteri başarıyla eklendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Müşteri eklenirken hata oluştu');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Müşteri başarıyla güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Müşteri güncellenirken hata oluştu');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Müşteri başarıyla silindi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Müşteri silinirken hata oluştu');
    },
  });
};

export const useRecentTurkAkCustomers = () => {
  return useQuery({
    queryKey: ['customers', 'recent-turkak'],
    queryFn: customerService.getRecentTurkAk,
  });
};

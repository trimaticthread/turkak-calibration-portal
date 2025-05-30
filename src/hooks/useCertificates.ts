
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateService } from '@/services/certificateService';
import { Certificate } from '@/types/api.types';
import { toast } from 'sonner';

export const useCertificates = (page = 1, pageSize = 10, search = '') => {
  return useQuery({
    queryKey: ['certificates', page, pageSize, search],
    queryFn: () => certificateService.getAll(page, pageSize, search),
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificateService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: certificateService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Sertifika başarıyla oluşturuldu!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Sertifika oluşturulurken hata oluştu');
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Certificate> }) =>
      certificateService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Sertifika başarıyla güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Sertifika güncellenirken hata oluştu');
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: certificateService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Sertifika başarıyla silindi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Sertifika silinirken hata oluştu');
    },
  });
};

export const useGenerateQR = () => {
  return useMutation({
    mutationFn: certificateService.generateQR,
    onSuccess: () => {
      toast.success('QR kod başarıyla oluşturuldu!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'QR kod oluşturulurken hata oluştu');
    },
  });
};

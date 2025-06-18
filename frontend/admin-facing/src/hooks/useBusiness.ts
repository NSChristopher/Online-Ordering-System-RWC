import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BusinessInfo, UpdateBusinessInfoData } from '@/types';
import api from '@/lib/api';

export const useBusiness = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch business info
  const fetchBusinessInfo = async () => {
    try {
      const response = await api.get('/business');
      setBusinessInfo(response.data);
    } catch (error) {
      console.error('Error fetching business info:', error);
      toast.error('Failed to load business information');
    }
  };

  // Update business info
  const updateBusinessInfo = async (data: UpdateBusinessInfoData) => {
    try {
      const response = await api.put('/business', data);
      setBusinessInfo(response.data);
      toast.success('Business information updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating business info:', error);
      toast.error('Failed to update business information');
      throw error;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchBusinessInfo();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    businessInfo,
    loading,
    updateBusinessInfo,
    refreshData: fetchBusinessInfo,
  };
};
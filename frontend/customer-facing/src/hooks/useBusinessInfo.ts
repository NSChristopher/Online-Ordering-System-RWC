import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BusinessInfo } from '@/types';
import api from '@/lib/api';

export const useBusinessInfo = () => {
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
    refreshData: fetchBusinessInfo,
  };
};
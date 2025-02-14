'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProductStock, removeProductQuantity } from '../api/productApi';
import type { Stock } from '../types';

export function useStockUpdate(productId: string) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Stock | null>(null);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ quantity }: { quantity: number }) =>
      updateProductStock(productId, selectedWarehouse!.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      setShowUpdateModal(false);
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ quantity }: { quantity: number }) =>
      removeProductQuantity(productId, selectedWarehouse!.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      setShowUpdateModal(false);
    },
  });

  const handleStockUpdate = (quantity: number) => {
    if (selectedWarehouse) {
      updateMutation.mutate({ quantity });
    }
  };

  const handleStockRemove = (quantity: number) => {
    if (selectedWarehouse) {
      removeMutation.mutate({ quantity });
    }
  };

  return {
    showUpdateModal,
    setShowUpdateModal,
    selectedWarehouse,
    setSelectedWarehouse,
    handleStockUpdate,
    handleStockRemove,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

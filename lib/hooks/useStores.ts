'use client';

import { useState, useEffect, useCallback } from 'react';
import { Store, ListStoresResponse, CreateStoreResponse, DeleteStoreResponse } from '@/lib/types';

interface UseStoresReturn {
  stores: Store[];
  isLoading: boolean;
  error: string | null;
  createStore: (displayName: string) => Promise<Store | null>;
  deleteStore: (storeName: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing file search stores
 *
 * Provides CRUD operations for stores with automatic refetching
 * and loading/error state management.
 *
 * @returns Store data and operations
 */
export function useStores(): UseStoresReturn {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all stores from the API
   */
  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/stores');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch stores');
      }

      const result = await response.json();
      setStores(result.data?.stores || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stores';
      setError(errorMessage);
      console.error('Error fetching stores:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new file search store
   *
   * @param displayName - The display name for the new store
   * @returns The created store or null if creation failed
   */
  const createStore = useCallback(async (displayName: string): Promise<Store | null> => {
    try {
      setError(null);

      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create store');
      }

      const result = await response.json();

      // Refetch stores to update the list
      await fetchStores();

      return result.data?.store || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create store';
      setError(errorMessage);
      console.error('Error creating store:', err);
      return null;
    }
  }, [fetchStores]);

  /**
   * Delete a file search store
   *
   * @param storeName - The name (ID) of the store to delete
   * @returns True if deletion was successful, false otherwise
   */
  const deleteStore = useCallback(async (storeName: string): Promise<boolean> => {
    try {
      setError(null);

      // Extract the store ID from the full name (e.g., "fileSearchStores/123" -> "123")
      const storeId = storeName.includes('/')
        ? storeName.split('/').pop()
        : storeName;

      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete store');
      }

      // Refetch stores to update the list
      await fetchStores();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete store';
      setError(errorMessage);
      console.error('Error deleting store:', err);
      return false;
    }
  }, [fetchStores]);

  /**
   * Manually refetch stores
   */
  const refetch = useCallback(async () => {
    await fetchStores();
  }, [fetchStores]);

  // Fetch stores on mount
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    isLoading,
    error,
    createStore,
    deleteStore,
    refetch,
  };
}

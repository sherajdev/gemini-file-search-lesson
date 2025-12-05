'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document } from '@/lib/types';

interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  deleteDocument: (documentId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing documents in a file search store
 *
 * Provides operations for listing and deleting documents with automatic refetching
 * and loading/error state management.
 *
 * @param storeId - The store ID (e.g., "abc123")
 * @param storeName - The full store name (e.g., "fileSearchStores/abc123")
 * @returns Document data and operations
 */
export function useDocuments(storeId: string, storeName: string): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all documents from the store
   */
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/stores/${storeId}/documents`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch documents');
      }

      const result = await response.json();
      setDocuments(result.data?.documents || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  /**
   * Delete a document from the store
   *
   * @param documentId - The document ID (e.g., "doc-123")
   * @returns True if deletion was successful, false otherwise
   */
  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/stores/${storeId}/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete document');
      }

      // Refetch documents to update the list
      await fetchDocuments();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      console.error('Error deleting document:', err);
      return false;
    }
  }, [storeId, fetchDocuments]);

  /**
   * Manually refetch documents
   */
  const refetch = useCallback(async () => {
    await fetchDocuments();
  }, [fetchDocuments]);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    deleteDocument,
    refetch,
  };
}

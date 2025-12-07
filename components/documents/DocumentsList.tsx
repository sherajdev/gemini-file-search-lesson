'use client';

import { useState } from 'react';
import { Document } from '@/lib/types';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { DocumentItem } from './DocumentItem';
import { DocumentItemSkeleton } from './DocumentItemSkeleton';
import { EmptyDocumentsState } from './EmptyDocumentsState';
import { DeleteDocumentModal } from './DeleteDocumentModal';
import { Button } from '@/components/ui/Button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface DocumentsListProps {
  storeId: string;
  storeName: string;
}

/**
 * DocumentsList Component
 *
 * Main container for displaying and managing documents in a store.
 * Handles loading, error, and empty states, and orchestrates document deletion.
 */
export function DocumentsList({ storeId, storeName }: DocumentsListProps) {
  const { documents, isLoading, error, deleteDocument, refetch } = useDocuments(storeId, storeName);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /**
   * Handle delete button click
   */
  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async (document: Document) => {
    // Extract document ID from full name (e.g., "fileSearchStores/xyz/documents/abc" -> "abc")
    const documentId = document.name.split('/').pop();
    if (!documentId) {
      console.error('Invalid document name:', document.name);
      return;
    }

    await deleteDocument(documentId);
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  /**
   * Handle manual refresh
   */
  const handleRefresh = () => {
    refetch();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <DocumentItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Failed to Load Documents</h3>
          <p className="text-sm text-gray-600 max-w-md">{error}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Empty State
  if (documents.length === 0) {
    return <EmptyDocumentsState storeId={storeId} />;
  }

  // Documents List
  return (
    <div className="space-y-4">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {documents.length} {documents.length === 1 ? 'document' : 'documents'}
        </p>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Document Items */}
      <div className="space-y-3">
        {documents.map((document) => (
          <DocumentItem
            key={document.name}
            document={document}
            onDelete={() => handleDeleteClick(document)}
          />
        ))}
      </div>

      {/* Delete Modal */}
      <DeleteDocumentModal
        document={documentToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

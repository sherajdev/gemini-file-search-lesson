'use client';

import { useState } from 'react';
import { Store } from '@/lib/types';
import { StoreCard } from './StoreCard';
import { StoreCardSkeleton } from './StoreCardSkeleton';
import { CreateStoreModal } from './CreateStoreModal';
import { DeleteStoreModal } from './DeleteStoreModal';
import { Button } from '@/components/ui/Button';
import { Database, Plus, AlertCircle } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  isLoading: boolean;
  error: string | null;
  onCreateStore: (displayName: string) => Promise<void>;
  onDeleteStore: (store: Store) => Promise<void>;
}

/**
 * StoreList Component
 *
 * Displays a grid of file search stores with options to create and delete.
 * Shows loading states, empty states, and error messages.
 *
 * @param stores - Array of stores to display
 * @param isLoading - Whether stores are being loaded
 * @param error - Error message if fetch failed
 * @param onCreateStore - Callback to create a new store
 * @param onDeleteStore - Callback to delete a store
 */
export function StoreList({
  stores,
  isLoading,
  error,
  onCreateStore,
  onDeleteStore,
}: StoreListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (store: Store) => {
    setStoreToDelete(store);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (store: Store) => {
    await onDeleteStore(store);
    setIsDeleteModalOpen(false);
    setStoreToDelete(null);
  };

  const handleCreateConfirm = async (displayName: string) => {
    await onCreateStore(displayName);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Failed to Load Stores</h3>
          <p className="text-sm text-gray-600 max-w-md">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Empty State
  if (stores.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Database className="w-12 h-12 text-blue-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">No Stores Yet</h3>
            <p className="text-gray-600 max-w-md">
              Create your first file search store to start uploading documents
              and building your knowledge base.
            </p>
          </div>
          <Button onClick={handleCreateClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Store
          </Button>
        </div>

        {/* Create Modal */}
        <CreateStoreModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onConfirm={handleCreateConfirm}
        />
      </>
    );
  }

  // Stores Grid
  return (
    <>
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {stores.length} {stores.length === 1 ? 'Store' : 'Stores'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your file search stores and documents
          </p>
        </div>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Store
        </Button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard
            key={store.name}
            store={store}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* Create Modal */}
      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateConfirm}
      />

      {/* Delete Modal */}
      <DeleteStoreModal
        store={storeToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStoreToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

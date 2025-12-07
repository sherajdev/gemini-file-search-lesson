'use client';

import { useStores } from '@/lib/hooks/useStores';
import { StoreList } from '@/components/stores/StoreList';
import { useToast } from '@/lib/hooks/useToast';
import { Store } from '@/lib/types';

export default function StoresPage() {
  const { stores, isLoading, error, createStore, deleteStore } = useStores();
  const { toast } = useToast();

  const handleCreateStore = async (displayName: string) => {
    const store = await createStore(displayName);
    if (store) {
      toast({
        title: 'Store Created',
        description: `Successfully created "${displayName}"`,
        variant: 'success',
      });
    } else {
      toast({
        title: 'Creation Failed',
        description: 'Failed to create store. Please try again.',
        variant: 'error',
      });
    }
  };

  const handleDeleteStore = async (store: Store) => {
    const success = await deleteStore(store.name);
    if (success) {
      toast({
        title: 'Store Deleted',
        description: `Successfully deleted "${store.displayName}"`,
        variant: 'success',
      });
    } else {
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete store. Please try again.',
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Search Stores</h1>
          <p className="mt-2 text-gray-600">
            Manage your file search stores and uploaded documents
          </p>
        </div>
      </div>

      {/* Store List */}
      <StoreList
        stores={stores}
        isLoading={isLoading}
        error={error}
        onCreateStore={handleCreateStore}
        onDeleteStore={handleDeleteStore}
      />
    </div>
  );
}

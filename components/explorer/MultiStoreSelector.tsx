'use client';

import React, { useState, useMemo } from 'react';
import { Search, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Store } from '@/lib/types';

interface MultiStoreSelectorProps {
  stores: Store[];
  selectedStoreNames: string[];
  onSelectionChange: (storeNames: string[]) => void;
  isLoading?: boolean;
  showFileCount?: boolean;
}

export function MultiStoreSelector({
  stores,
  selectedStoreNames,
  onSelectionChange,
  isLoading = false,
  showFileCount = false,
}: MultiStoreSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;

    const query = searchQuery.toLowerCase();
    return stores.filter(store =>
      store.displayName.toLowerCase().includes(query) ||
      store.name.toLowerCase().includes(query)
    );
  }, [stores, searchQuery]);

  // Handle individual store toggle
  const handleToggleStore = (storeName: string) => {
    if (selectedStoreNames.includes(storeName)) {
      onSelectionChange(selectedStoreNames.filter(name => name !== storeName));
    } else {
      onSelectionChange([...selectedStoreNames, storeName]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    onSelectionChange(filteredStores.map(store => store.name));
  };

  // Handle deselect all
  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  // Check if all filtered stores are selected
  const allSelected = filteredStores.length > 0 &&
    filteredStores.every(store => selectedStoreNames.includes(store.name));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No stores available.</p>
        <p className="text-sm mt-2">Create a store to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Select All / Deselect All Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleSelectAll}
          disabled={allSelected}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All
        </Button>
        <Button
          onClick={handleDeselectAll}
          disabled={selectedStoreNames.length === 0}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Square className="w-4 h-4 mr-2" />
          Deselect All
        </Button>
      </div>

      {/* Selected Count */}
      {selectedStoreNames.length > 0 && (
        <div className="text-sm text-gray-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          {selectedStoreNames.length} of {stores.length} store{stores.length !== 1 ? 's' : ''} selected
        </div>
      )}

      {/* Store List */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {filteredStores.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No stores match your search.
          </div>
        ) : (
          filteredStores.map((store) => {
            const isSelected = selectedStoreNames.includes(store.name);

            return (
              <label
                key={store.name}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleStore(store.name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="ml-3 flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {store.displayName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {store.name}
                  </div>
                </div>
                {showFileCount && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {/* File count would come from store metadata if available */}
                    {/* For now, we'll leave this as a placeholder */}
                  </div>
                )}
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}

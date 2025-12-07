'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Database } from 'lucide-react';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (displayName: string) => Promise<void>;
}

/**
 * CreateStoreModal Component
 *
 * Modal for creating a new file search store.
 * Prompts the user to enter a display name.
 *
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when modal is closed
 * @param onConfirm - Callback when creation is confirmed
 */
export function CreateStoreModal({
  isOpen,
  onClose,
  onConfirm,
}: CreateStoreModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (displayName.trim().length < 3) {
      setError('Display name must be at least 3 characters');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await onConfirm(displayName.trim());
      // Reset form and close modal
      setDisplayName('');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create store';
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setDisplayName('');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create New Store</ModalTitle>
        </ModalHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Description */}
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Create a File Search Store
          </h3>
          <p className="text-sm text-gray-600">
            A store is a container for your documents and their embeddings.
          </p>
        </div>

        {/* Display Name Input */}
        <div className="space-y-2">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <Input
            id="displayName"
            type="text"
            placeholder="e.g., Product Documentation"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setError(null);
            }}
            disabled={isCreating}
            className={error ? 'border-red-500 focus:ring-red-500' : ''}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <p className="text-xs text-gray-500">
            Choose a descriptive name to identify this store.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isCreating || !displayName.trim()}
            className="flex-1"
          >
            {isCreating ? 'Creating...' : 'Create Store'}
          </Button>
        </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

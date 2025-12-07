'use client';

import { useState } from 'react';
import { Store } from '@/lib/types';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteStoreModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (store: Store) => Promise<void>;
}

/**
 * DeleteStoreModal Component
 *
 * Confirmation modal for deleting a file search store.
 * Warns the user that this action is irreversible.
 *
 * @param store - The store to delete
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when modal is closed
 * @param onConfirm - Callback when deletion is confirmed
 */
export function DeleteStoreModal({
  store,
  isOpen,
  onClose,
  onConfirm,
}: DeleteStoreModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!store) return;

    setIsDeleting(true);
    try {
      await onConfirm(store);
      onClose();
    } catch (error) {
      console.error('Error deleting store:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!store) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Store</ModalTitle>
        </ModalHeader>
        <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete "{store.displayName}"?
          </h3>
          <p className="text-sm text-gray-600">
            This action cannot be undone. All files and embeddings in this store
            will be permanently deleted.
          </p>
        </div>

        {/* Store Info */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Store ID</p>
          <p className="text-sm text-gray-900 font-mono truncate" title={store.name}>
            {store.name}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? 'Deleting...' : 'Delete Store'}
          </Button>
        </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

'use client';

import { useState } from 'react';
import { Document } from '@/lib/types';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteDocumentModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (document: Document) => Promise<void>;
}

/**
 * DeleteDocumentModal Component
 *
 * Confirmation modal for deleting a document from a file search store.
 * Warns the user that this action is irreversible.
 *
 * @param document - The document to delete
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when modal is closed
 * @param onConfirm - Callback when deletion is confirmed
 */
export function DeleteDocumentModal({
  document,
  isOpen,
  onClose,
  onConfirm,
}: DeleteDocumentModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!document) return;

    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(document);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      console.error('Error deleting document:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!document) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Document</ModalTitle>
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
              Delete "{document.displayName}"?
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The document and its embeddings
              will be permanently removed from the store.
            </p>
          </div>

          {/* Document Info */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500">Document ID</p>
            <p className="text-sm text-gray-900 font-mono truncate" title={document.name}>
              {document.name}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

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
              {isDeleting ? 'Deleting...' : 'Delete Document'}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

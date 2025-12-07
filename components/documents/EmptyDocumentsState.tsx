import Link from 'next/link';
import { FileUp, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyDocumentsStateProps {
  storeId: string;
}

/**
 * Empty state component displayed when a store has no documents
 */
export function EmptyDocumentsState({ storeId }: EmptyDocumentsStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 rounded-full">
          <Inbox className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No documents yet
      </h3>

      <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
        Upload your first file to this store to start using File Search with Gemini AI.
      </p>

      <Link href={`/stores/${storeId}/upload`}>
        <Button variant="primary" className="inline-flex items-center gap-2">
          <FileUp className="w-4 h-4" />
          Upload File
        </Button>
      </Link>
    </div>
  );
}

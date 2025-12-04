'use client';

import Link from 'next/link';
import { Store } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Database, Upload, Search, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StoreCardProps {
  store: Store;
  onDelete: (store: Store) => void;
}

/**
 * StoreCard Component
 *
 * Displays a single file search store with actions for viewing,
 * uploading files, querying, and deleting.
 *
 * @param store - The store to display
 * @param onDelete - Callback when delete button is clicked
 */
export function StoreCard({ store, onDelete }: StoreCardProps) {
  // Extract store ID from the full name (e.g., "fileSearchStores/123" -> "123")
  const storeId = store.name.includes('/')
    ? store.name.split('/').pop()
    : store.name;

  // Format creation time
  const createdAt = store.createTime
    ? formatDistanceToNow(new Date(store.createTime), { addSuffix: true })
    : 'Unknown';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{store.displayName}</CardTitle>
              <CardDescription className="text-xs mt-1">
                Created {createdAt}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(store)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {/* View Store Details */}
          <Link href={`/stores/${storeId}`}>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </Link>

          {/* Upload File */}
          <Link href={`/stores/${storeId}/upload`}>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
          </Link>

          {/* Query Store */}
          <Link href={`/stores/${storeId}/query`}>
            <Button variant="primary" className="w-full justify-start gap-2">
              <Search className="w-4 h-4" />
              Query Store
            </Button>
          </Link>
        </div>

        {/* Store ID (for debugging) */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 truncate" title={store.name}>
            ID: {storeId}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

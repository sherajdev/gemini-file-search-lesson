'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, GetStoreResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Database, Upload, Search, ArrowLeft, Calendar, Hash, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StoreDetailPageProps {
  params: Promise<{ storeId: string }>;
}

export default function StoreDetailPage({ params }: StoreDetailPageProps) {
  const resolvedParams = use(params);
  const { storeId } = resolvedParams;
  const router = useRouter();

  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/stores/${storeId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch store');
        }

        const result = await response.json();
        setStore(result.data?.store || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch store';
        setError(errorMessage);
        console.error('Error fetching store:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading store details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Failed to Load Store</h3>
            <p className="text-sm text-gray-600 max-w-md">
              {error || 'Store not found'}
            </p>
          </div>
          <Button onClick={() => router.push('/stores')} variant="outline">
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

  // Format timestamps
  const createdAt = store.createTime
    ? formatDistanceToNow(new Date(store.createTime), { addSuffix: true })
    : 'Unknown';
  const updatedAt = store.updateTime
    ? formatDistanceToNow(new Date(store.updateTime), { addSuffix: true })
    : 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/stores"
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Stores
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{store.displayName}</span>
        </div>

        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{store.displayName}</h1>
              <p className="text-sm text-gray-600 mt-1">
                File Search Store
              </p>
            </div>
          </div>
        </div>

        {/* Store Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Store Information</CardTitle>
            <CardDescription>
              Detailed information about this file search store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Store ID */}
            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Store ID</p>
                <p className="text-sm text-gray-900 font-mono break-all mt-1">
                  {store.name}
                </p>
              </div>
            </div>

            {/* Created */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Created</p>
                <p className="text-sm text-gray-900 mt-1">{createdAt}</p>
                {store.createTime && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(store.createTime).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-sm text-gray-900 mt-1">{updatedAt}</p>
                {store.updateTime && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(store.updateTime).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Manage files and query this store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload File */}
              <Link href={`/stores/${storeId}/upload`}>
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <div className="text-center">
                    <p className="font-medium">Upload File</p>
                    <p className="text-xs text-gray-500">
                      Add documents to this store
                    </p>
                  </div>
                </Button>
              </Link>

              {/* Query Store */}
              <Link href={`/stores/${storeId}/query`}>
                <Button variant="primary" className="w-full h-24 flex-col gap-2">
                  <Search className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-medium">Query Store</p>
                    <p className="text-xs opacity-90">
                      Ask questions about your documents
                    </p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Future: Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Files</CardTitle>
            <CardDescription>
              Documents uploaded to this store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">File listing coming in a future update</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

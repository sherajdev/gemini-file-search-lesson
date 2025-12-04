'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { QueryInterface, QueryOptions } from '@/components/query/QueryInterface';
import { AnswerDisplay } from '@/components/query/AnswerDisplay';
import { CitationList } from '@/components/query/CitationList';
import { useQuery } from '@/lib/hooks/useQuery';
import { Store } from '@/lib/types';
import { Search, ArrowLeft, AlertCircle } from 'lucide-react';

interface QueryPageProps {
  params: Promise<{ storeId: string }>;
}

export default function QueryPage({ params }: QueryPageProps) {
  const { storeId } = use(params);
  const { query, isLoading, response, error } = useQuery();

  const [store, setStore] = useState<Store | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Fetch store details to display store name
  useEffect(() => {
    const fetchStore = async () => {
      try {
        setIsLoadingStore(true);
        const response = await fetch(`/api/stores/${storeId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch store details');
        }

        const data = await response.json();
        setStore(data.data?.store || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch store';
        setStoreError(errorMessage);
        console.error('Error fetching store:', err);
      } finally {
        setIsLoadingStore(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const handleQuery = async (question: string, options: QueryOptions) => {
    await query(
      question,
      options.storeNames,
      options.metadataFilter,
      options.model
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/stores" className="text-gray-500 hover:text-gray-700">
            Stores
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/stores/${storeId}`} className="text-gray-500 hover:text-gray-700">
            {store?.displayName || 'Store'}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Query</span>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Query Documents</h1>
              <p className="text-sm text-gray-600 mt-1">
                Ask questions about your documents and get AI-powered answers with citations
              </p>
            </div>
          </div>
        </div>

        {/* Store Loading/Error State */}
        {isLoadingStore ? (
          <Card className="p-6">
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          </Card>
        ) : storeError ? (
          <Card className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{storeError}</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Query Interface */}
            <Card className="p-6">
              <QueryInterface
                storeId={store?.name || storeId}
                storeName={store?.displayName}
                onSubmit={handleQuery}
                isLoading={isLoading}
              />
            </Card>

            {/* Error Display */}
            {error && !isLoading && (
              <Card className="p-6 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-900 mb-1">Query Error</h3>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Answer Display */}
            {(response || isLoading) && (
              <AnswerDisplay
                answer={response?.answer || ''}
                isLoading={isLoading}
              />
            )}

            {/* Citations */}
            {response?.groundingMetadata?.groundingChunks && (
              <CitationList
                citations={response.groundingMetadata.groundingChunks}
              />
            )}

            {/* Help Card - Show when no results yet */}
            {!response && !isLoading && !error && (
              <Card className="p-6 bg-blue-50 border-blue-100">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-blue-900">
                    How to use the query interface
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <span>Type your question in the text area above</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <span>
                        Optionally, expand "Advanced Options" to add metadata filters or change the model
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <span>Click "Search Documents" to get your answer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">4.</span>
                      <span>
                        Review the AI-generated answer and explore the source citations below
                      </span>
                    </li>
                  </ul>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Back Button */}
        <div className="flex justify-start">
          <Link href={`/stores/${storeId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

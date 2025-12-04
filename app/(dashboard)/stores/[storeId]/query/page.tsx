'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, ArrowLeft } from 'lucide-react';

interface QueryPageProps {
  params: Promise<{ storeId: string }>;
}

export default function QueryPage({ params }: QueryPageProps) {
  const { storeId } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/stores" className="text-gray-500 hover:text-gray-700">
            Stores
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/stores/${storeId}`} className="text-gray-500 hover:text-gray-700">
            Store
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Query</span>
        </div>

        {/* Placeholder */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle>Query Interface</CardTitle>
                <CardDescription>Coming in Phase 6</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This page will allow you to ask questions about your documents and receive AI-powered answers with citations.
            </p>
            <Link href={`/stores/${storeId}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

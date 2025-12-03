import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Database, FileText, Search } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Welcome back!</p>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Get started by creating a store and uploading documents.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Manage Stores</CardTitle>
            <CardDescription>
              Create and manage your file search stores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/stores">
              <Button className="w-full">Go to Stores</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 border border-green-100">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Upload files with custom chunking and metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/stores">
              <Button variant="outline" className="w-full">Upload Files</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 border border-purple-100">
              <Search className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Explore Citations</CardTitle>
            <CardDescription>
              View and export query results and citations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/explorer">
              <Button variant="outline" className="w-full">Open Explorer</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to start using Gemini File Search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
                1
              </span>
              <div>
                <h3 className="font-medium text-gray-900">Create a File Search Store</h3>
                <p className="text-sm text-gray-600">
                  Stores are containers for your document embeddings. Go to the Stores page to create one.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
                2
              </span>
              <div>
                <h3 className="font-medium text-gray-900">Upload Documents</h3>
                <p className="text-sm text-gray-600">
                  Upload PDFs, text files, or other documents. Configure chunking and add metadata for better retrieval.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
                3
              </span>
              <div>
                <h3 className="font-medium text-gray-900">Query Your Documents</h3>
                <p className="text-sm text-gray-600">
                  Ask questions in natural language and get AI-generated answers with detailed citations.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

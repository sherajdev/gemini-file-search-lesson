import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function StoresPage() {
  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Search Stores</h1>
          <p className="mt-2 text-gray-600">
            Manage your file search stores and uploaded documents
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Store management will be implemented in Phase 4
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This page will allow you to create, view, and delete file search stores.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

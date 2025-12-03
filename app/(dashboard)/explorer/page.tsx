import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ExplorerPage() {
  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Citation Explorer</h1>
        <p className="mt-2 text-gray-600">
          Explore query results and detailed citations from your searches
        </p>
      </div>

      {/* Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Citation explorer will be implemented in Phase 7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This page will allow you to view detailed citations, filter by metadata, and export to various formats.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

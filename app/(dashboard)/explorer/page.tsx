import { CitationExplorer } from '@/components/explorer/CitationExplorer';

export default function ExplorerPage() {
  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Citation Explorer
        </h1>
        <p className="mt-2 text-gray-600">
          Explore and analyze citations from your query history
        </p>
      </div>

      <CitationExplorer />
    </div>
  );
}

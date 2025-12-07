'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { GroundingChunk } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface CitationListProps {
  citations: GroundingChunk[];
  className?: string;
}

interface CitationCardProps {
  citation: GroundingChunk;
  index: number;
}

function CitationCard({ citation, index }: CitationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { retrievedContext } = citation;

  if (!retrievedContext) {
    return null;
  }

  const fileName = retrievedContext.title || retrievedContext.uri || 'Unknown source';
  const snippet = retrievedContext.text || 'No text available';
  const displaySnippet = snippet.length > 200 ? snippet.slice(0, 200) + '...' : snippet;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <h4 className="text-sm font-medium text-gray-900 truncate" title={fileName}>
                  {fileName}
                </h4>
              </div>
              {retrievedContext.uri && (
                <p className="text-xs text-gray-500 truncate">{retrievedContext.uri}</p>
              )}
            </div>
          </div>
        </div>

        {/* Snippet Preview */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {isExpanded ? snippet : displaySnippet}
          </p>
        </div>

        {/* Expand Button */}
        {snippet.length > 200 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 -ml-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Show less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Show full text</span>
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function CitationList({ citations, className }: CitationListProps) {
  if (!citations || citations.length === 0) {
    return null;
  }

  // Filter out citations without retrieved context
  const validCitations = citations.filter((c) => c.retrievedContext);

  if (validCitations.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sources</h3>
          <p className="text-sm text-gray-600 mt-1">
            {validCitations.length} {validCitations.length === 1 ? 'citation' : 'citations'} found
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {validCitations.map((citation, index) => (
          <CitationCard key={index} citation={citation} index={index} />
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="p-4">
          <p className="text-sm text-blue-900">
            <span className="font-medium">About Citations:</span> These are the document excerpts that
            were used to generate the answer above. Each citation shows the source file and the relevant
            text chunk that was retrieved.
          </p>
        </div>
      </Card>
    </div>
  );
}

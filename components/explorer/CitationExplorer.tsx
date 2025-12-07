'use client';

import React, { useState, useMemo } from 'react';
import { Download, Search, FileText, Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useQuery } from '@/lib/hooks/useQuery';
import { GroundingChunk } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface ExpandedCitation {
  [key: number]: boolean;
}

export function CitationExplorer() {
  const { history, clearHistory } = useQuery();
  const [selectedQueryIndex, setSelectedQueryIndex] = useState<number | null>(null);
  const [citationFilter, setCitationFilter] = useState('');
  const [expandedCitations, setExpandedCitations] = useState<ExpandedCitation>({});

  // Get selected query from history
  const selectedQuery = selectedQueryIndex !== null ? history[selectedQueryIndex] : null;

  // Extract citations from selected query
  const citations = useMemo(() => {
    if (!selectedQuery?.groundingMetadata?.groundingChunks) {
      return [];
    }
    return selectedQuery.groundingMetadata.groundingChunks;
  }, [selectedQuery]);

  // Filter citations based on search query
  const filteredCitations = useMemo(() => {
    if (!citationFilter.trim()) return citations;

    const query = citationFilter.toLowerCase();
    return citations.filter((citation, index) => {
      const text = citation.retrievedContext?.text?.toLowerCase() || '';
      const title = citation.retrievedContext?.title?.toLowerCase() || '';
      const uri = citation.retrievedContext?.uri?.toLowerCase() || '';

      return text.includes(query) || title.includes(query) || uri.includes(query);
    });
  }, [citations, citationFilter]);

  // Toggle citation expansion
  const toggleCitation = (index: number) => {
    setExpandedCitations(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Copy citation text
  const copyCitation = (citation: GroundingChunk) => {
    const text = citation.retrievedContext?.text || '';
    navigator.clipboard.writeText(text);
  };

  // Export functions
  const exportToJSON = () => {
    if (!selectedQuery) return;

    const data = {
      query: {
        question: selectedQuery.question,
        timestamp: selectedQuery.timestamp,
        storeNames: selectedQuery.storeNames,
        answer: selectedQuery.answer,
      },
      citations: filteredCitations.map((citation, index) => ({
        index,
        source: citation.retrievedContext?.title || citation.retrievedContext?.uri || 'Unknown',
        text: citation.retrievedContext?.text || '',
        uri: citation.retrievedContext?.uri,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citations-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!selectedQuery) return;

    const headers = ['Index', 'Source', 'Text', 'URI'];
    const rows = filteredCitations.map((citation, index) => [
      index.toString(),
      citation.retrievedContext?.title || citation.retrievedContext?.uri || 'Unknown',
      citation.retrievedContext?.text?.replace(/"/g, '""') || '',
      citation.retrievedContext?.uri || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = () => {
    if (!selectedQuery) return;

    const markdown = `# Query Results\n\n## Question\n${selectedQuery.question}\n\n**Date:** ${format(new Date(selectedQuery.timestamp), 'PPpp')}\n\n**Stores:** ${selectedQuery.storeNames.join(', ')}\n\n## Answer\n\n${selectedQuery.answer}\n\n## Citations\n\n${filteredCitations.map((citation, index) => {
      const source = citation.retrievedContext?.title || citation.retrievedContext?.uri || 'Unknown';
      const text = citation.retrievedContext?.text || '';
      return `### Citation ${index + 1}: ${source}\n\n${text}\n`;
    }).join('\n')}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citations-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Empty state
  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <CardTitle className="text-xl mb-2">No Query History</CardTitle>
          <CardDescription className="mb-6">
            Start by querying some stores to see citations here
          </CardDescription>
          <Button onClick={() => window.location.href = '/stores'}>
            Go to Stores
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Query History Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Query History</CardTitle>
              <CardDescription>Select a query to explore its citations</CardDescription>
            </div>
            <Button
              onClick={clearHistory}
              variant="outline"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <select
            value={selectedQueryIndex?.toString() || ''}
            onChange={(e) => setSelectedQueryIndex(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select a query to explore...</option>
            {history.map((item, index) => (
              <option key={index} value={index}>
                {format(new Date(item.timestamp), 'PPpp')} - {item.question.slice(0, 60)}
                {item.question.length > 60 ? '...' : ''}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Split Pane Layout */}
      {selectedQuery && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Pane: Query & Answer */}
          <div className="space-y-6">
            {/* Query Details */}
            <Card>
              <CardHeader>
                <CardTitle>Query Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-1">
                    Question:
                  </label>
                  <p className="text-gray-700">
                    {selectedQuery.question}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-1">
                    Date:
                  </label>
                  <p className="text-gray-600 text-sm">
                    {format(new Date(selectedQuery.timestamp), 'PPpp')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-1">
                    Stores:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuery.storeNames.map((name) => (
                      <span
                        key={name}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-1">
                    Model:
                  </label>
                  <p className="text-gray-600 text-sm">
                    {selectedQuery.model}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Answer */}
            <Card>
              <CardHeader>
                <CardTitle>Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown
                    components={{
                      p({ children }) {
                        return <p className="mb-4 last:mb-0 text-gray-700 leading-relaxed">{children}</p>;
                      },
                      h1({ children }) {
                        return <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>;
                      },
                      h2({ children }) {
                        return <h2 className="text-xl font-bold mb-3 text-gray-900">{children}</h2>;
                      },
                      h3({ children }) {
                        return <h3 className="text-lg font-semibold mb-2 text-gray-900">{children}</h3>;
                      },
                      ul({ children }) {
                        return <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>;
                      },
                    }}
                  >
                    {selectedQuery.answer}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Pane: Citations */}
          <div className="space-y-6">
            {/* Citation Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Citations ({filteredCitations.length})</CardTitle>
                    <CardDescription>Source documents used to generate the answer</CardDescription>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={exportToJSON}
                      variant="outline"
                      size="sm"
                      disabled={filteredCitations.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                    <Button
                      onClick={exportToCSV}
                      variant="outline"
                      size="sm"
                      disabled={filteredCitations.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      onClick={exportToMarkdown}
                      variant="outline"
                      size="sm"
                      disabled={filteredCitations.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      MD
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Citation Filter */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Filter citations..."
                    value={citationFilter}
                    onChange={(e) => setCitationFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Citation List */}
            <div className="space-y-4">
              {filteredCitations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">
                      {citations.length === 0
                        ? 'No citations found for this query'
                        : 'No citations match your filter'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredCitations.map((citation, index) => {
                  const isExpanded = expandedCitations[index];
                  const source = citation.retrievedContext?.title || citation.retrievedContext?.uri || 'Unknown Source';
                  const text = citation.retrievedContext?.text || '';
                  const preview = text.slice(0, 200) + (text.length > 200 ? '...' : '');

                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                Citation {index + 1}
                              </span>
                            </div>
                            <CardTitle className="text-base">{source}</CardTitle>
                          </div>
                          <Button
                            onClick={() => copyCitation(citation)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {isExpanded ? text : preview}
                        </div>

                        {/* Expand/Collapse Button */}
                        {text.length > 200 && (
                          <Button
                            onClick={() => toggleCitation(index)}
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-2" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-2" />
                                Show More
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

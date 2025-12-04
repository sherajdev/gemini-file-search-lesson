'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QueryInterfaceProps {
  storeId: string;
  storeName?: string;
  onSubmit: (question: string, options: QueryOptions) => void;
  isLoading?: boolean;
}

export interface QueryOptions {
  storeNames: string[];
  metadataFilter?: string;
  model?: string;
}

export function QueryInterface({
  storeId,
  storeName,
  onSubmit,
  isLoading = false,
}: QueryInterfaceProps) {
  const [question, setQuestion] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [metadataFilter, setMetadataFilter] = useState('');
  const [model, setModel] = useState('gemini-2.5-flash');

  const characterCount = question.length;
  const maxCharacters = 10000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question, {
        storeNames: [storeId],
        metadataFilter: metadataFilter || undefined,
        model,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Question Input */}
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Ask a question about your documents
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to know about your documents?"
          disabled={isLoading}
          className="w-full min-h-[150px] px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-y"
          maxLength={maxCharacters}
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>
            Querying store: <span className="font-medium">{storeName || storeId}</span>
          </span>
          <span className={characterCount > maxCharacters * 0.9 ? 'text-orange-600' : ''}>
            {characterCount} / {maxCharacters}
          </span>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="border border-gray-200 rounded-md">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>Advanced Options</span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showAdvanced && (
          <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
            {/* Metadata Filter */}
            <div>
              <label
                htmlFor="metadataFilter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Metadata Filter (Optional)
              </label>
              <input
                type="text"
                id="metadataFilter"
                value={metadataFilter}
                onChange={(e) => setMetadataFilter(e.target.value)}
                placeholder='e.g., category = "electronics" AND year > 2023'
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Filter results by file metadata. Supports operators: =, !=, &gt;, &lt;, &gt;=, &lt;=, AND, OR
              </p>
            </div>

            {/* Model Selector */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Model
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Experimental</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Gemini 2.5 Flash is recommended for most queries
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!question.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Searching...
          </>
        ) : (
          'Search Documents'
        )}
      </Button>

      {/* Example Questions */}
      {!question && !isLoading && (
        <div className="bg-gray-50 rounded-md p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Example questions:</p>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              <button
                type="button"
                onClick={() => setQuestion('What are the main topics covered in these documents?')}
                className="hover:text-blue-600 hover:underline text-left"
              >
                • What are the main topics covered in these documents?
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setQuestion('Can you summarize the key findings?')}
                className="hover:text-blue-600 hover:underline text-left"
              >
                • Can you summarize the key findings?
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setQuestion('What recommendations are mentioned?')}
                className="hover:text-blue-600 hover:underline text-left"
              >
                • What recommendations are mentioned?
              </button>
            </li>
          </ul>
        </div>
      )}
    </form>
  );
}

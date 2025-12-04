'use client';

import { useState, useEffect } from 'react';
import { QueryResponse, QueryRequest } from '@/lib/types';
import { useToast } from './useToast';

interface QueryHistoryItem extends QueryResponse {
  question: string;
  timestamp: string;
  storeNames: string[];
}

interface UseQueryResult {
  query: (question: string, storeNames: string[], metadataFilter?: string, model?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  response: QueryResponse | null;
  history: QueryHistoryItem[];
  clearHistory: () => void;
}

const HISTORY_KEY = 'gemini-query-history';
const MAX_HISTORY_ITEMS = 50;

export function useQuery(): UseQueryResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load query history:', error);
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save query history:', error);
      }
    }
  }, [history]);

  const query = async (
    question: string,
    storeNames: string[],
    metadataFilter?: string,
    model?: string
  ) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const requestBody: QueryRequest = {
        question,
        storeNames,
        metadataFilter,
        model: model || 'gemini-2.5-flash',
      };

      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.error || `Query failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.data?.answer) {
        throw new Error('No answer received from the API');
      }

      const queryResponse: QueryResponse = {
        answer: data.data.answer,
        groundingMetadata: data.data.groundingMetadata,
        model: data.data.model || requestBody.model || 'gemini-2.5-flash',
      };

      setResponse(queryResponse);

      // Add to history
      const historyItem: QueryHistoryItem = {
        ...queryResponse,
        question,
        timestamp: new Date().toISOString(),
        storeNames,
      };

      setHistory((prev) => {
        const updated = [historyItem, ...prev];
        // Keep only the most recent items
        return updated.slice(0, MAX_HISTORY_ITEMS);
      });

      toast({
        title: 'Query successful',
        description: 'Your question has been answered',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to query stores';
      setError(errorMessage);
      toast({
        title: 'Query failed',
        description: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    toast({
      title: 'History cleared',
      description: 'Your query history has been cleared',
    });
  };

  return {
    query,
    isLoading,
    error,
    response,
    history,
    clearHistory,
  };
}

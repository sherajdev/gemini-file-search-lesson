import { useState, useEffect, useCallback } from 'react';

interface OperationStatus {
  name: string;
  done: boolean;
  error?: {
    code: number;
    message: string;
  };
  metadata?: {
    '@type': string;
    [key: string]: any;
  };
}

interface UseOperationPollingResult {
  status: OperationStatus | null;
  isPolling: boolean;
  error: string | null;
  progress: number;
  startPolling: (operationName: string) => void;
  stopPolling: () => void;
}

/**
 * Hook for polling long-running operations from the Gemini API
 * Polls every 3 seconds until operation.done === true or timeout (5 minutes)
 *
 * Usage:
 * const { status, isPolling, error, progress, startPolling } = useOperationPolling();
 * startPolling(operation.name);
 */
export function useOperationPolling(): UseOperationPollingResult {
  const [status, setStatus] = useState<OperationStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  const startPolling = useCallback((operationName: string) => {
    setIsPolling(true);
    setError(null);
    setProgress(0);
    pollOperation(operationName);
  }, []);

  const pollOperation = async (operationName: string) => {
    const startTime = Date.now();
    const timeout = 5 * 60 * 1000; // 5 minutes
    const pollInterval = 3000; // 3 seconds

    while (true) {
      try {
        // Check timeout
        if (Date.now() - startTime > timeout) {
          setError('Operation timed out after 5 minutes');
          setIsPolling(false);
          return;
        }

        // Fetch operation status
        const response = await fetch(`/api/operations/${encodeURIComponent(operationName)}`);

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error?.message || errorData.error || 'Failed to fetch operation status';
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const operation = data.operation as OperationStatus;

        setStatus(operation);

        // Calculate progress (rough estimate based on time)
        const elapsed = Date.now() - startTime;
        const estimatedProgress = Math.min(95, (elapsed / 30000) * 100); // Assume 30s avg
        setProgress(operation.done ? 100 : estimatedProgress);

        // Check if operation is done
        if (operation.done) {
          if (operation.error) {
            setError(operation.error.message || 'Operation failed');
          }
          setIsPolling(false);
          return;
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Failed to poll operation';
        setError(errorMessage);
        setIsPolling(false);
        return;
      }
    }
  };

  return {
    status,
    isPolling,
    error,
    progress,
    startPolling,
    stopPolling,
  };
}

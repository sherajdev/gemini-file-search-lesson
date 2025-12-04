/**
 * Operation Polling Functions
 *
 * Handles long-running operations from the Gemini API, such as file uploads.
 * Operations are polled until completion or timeout.
 *
 * Pattern from: legacy/examples/test-file-search.js:20-31
 */

import { getGeminiClient } from './gemini-client';
import { Operation, GeminiApiError } from '@/lib/types';

const POLL_INTERVAL_MS = 3000; // 3 seconds
const MAX_POLL_ATTEMPTS = 100; // 5 minutes max (100 * 3s)

/**
 * Get the current status of an operation
 *
 * @param {string} operationName - The operation name (e.g., "operations/abc123")
 * @returns {Promise<Operation>} The operation object
 * @throws {GeminiApiError} If the operation cannot be retrieved
 */
export async function getOperation(operationName: string): Promise<Operation> {
  try {
    const ai = getGeminiClient();
    // The SDK expects { operation: <string or object> }
    // Pass the operation name string as the operation parameter
    const operation = await ai.operations.get({ operation: operationName } as any);

    if (!operation) {
      throw new Error('Operation not found');
    }

    return operation as any as Operation;
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to get operation: ${error.message}`,
      500,
      error.response?.data
    );
  }
}

/**
 * Wait for an operation to complete
 *
 * Polls the operation every 3 seconds until it's done or times out.
 * Based on pattern from test-file-search.js:20-31
 *
 * @param {Operation | string} operationOrName - The operation object or operation name
 * @returns {Promise<Operation>} The completed operation
 * @throws {GeminiApiError} If operation fails or times out
 */
export async function waitForOperation(
  operationOrName: Operation | string
): Promise<Operation> {
  const ai = getGeminiClient();

  // Handle both Operation object and string name
  let currentOp: Operation;
  if (typeof operationOrName === 'string') {
    currentOp = await getOperation(operationOrName);
  } else {
    currentOp = operationOrName;
  }

  let attempts = 0;

  while (!currentOp.done && attempts < MAX_POLL_ATTEMPTS) {
    // Wait for poll interval
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

    // Get updated operation status
    currentOp = await ai.operations.get({ operation: currentOp as any }) as any;
    attempts++;
  }

  // Check for timeout
  if (!currentOp.done) {
    throw new GeminiApiError(
      'Operation timed out after 5 minutes',
      408,
      { operationName: currentOp.name }
    );
  }

  // Check for operation error
  if (currentOp.error) {
    throw new GeminiApiError(
      `Operation failed: ${currentOp.error.message}`,
      500,
      currentOp.error
    );
  }

  return currentOp;
}

/**
 * Get operation progress as a percentage (if available)
 *
 * @param {Operation} operation - The operation object
 * @returns {number | null} Progress percentage (0-100) or null if not available
 */
export function getOperationProgress(operation: Operation): number | null {
  // Check if metadata contains progress information
  if (operation.metadata?.progressPercentage !== undefined) {
    return operation.metadata.progressPercentage;
  }

  // If operation is done, return 100%
  if (operation.done) {
    return 100;
  }

  // No progress information available
  return null;
}

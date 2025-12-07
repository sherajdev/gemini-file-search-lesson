/**
 * Operations API Route
 *
 * Handles polling for long-running operations (e.g., file uploads)
 * GET: Get the current status of an operation
 *
 * IMPORTANT: Next.js 15+ requires awaiting params in dynamic routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOperation, getOperationProgress } from '@/lib/api/operations';
import { GeminiApiError } from '@/lib/types';

/**
 * GET /api/operations/[operationId]
 * Get the status of a long-running operation
 *
 * The operationId is typically in the format "operations/abc123"
 * but can be provided with or without the "operations/" prefix
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ operationId: string }> }
) {
  try {
    // IMPORTANT: Await params in Next.js 15+
    const { operationId } = await params;

    // Ensure the operationId has the correct prefix
    const normalizedOperationId = operationId.startsWith('operations/')
      ? operationId
      : `operations/${operationId}`;

    // Get operation status
    const operation = await getOperation(normalizedOperationId);

    // Extract progress if available
    const progress = getOperationProgress(operation);

    return NextResponse.json({
      success: true,
      data: {
        operation,
        progress,
        isDone: operation.done,
        hasError: !!operation.error
      }
    });
  } catch (error: any) {
    console.error('[GET /api/operations/:operationId] Error:', error);

    if (error instanceof GeminiApiError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            details: error.details
          }
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to get operation status',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

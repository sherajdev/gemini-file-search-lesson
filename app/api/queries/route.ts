/**
 * Query API Route
 *
 * Handles querying File Search Stores with AI-powered retrieval
 * POST: Submit a query and get an answer with citations
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryStores, validateMetadataFilter } from '@/lib/api/queries';
import { GeminiApiError, QueryRequest } from '@/lib/types';
import { z } from 'zod';

// Validation schema for query request
const QueryRequestSchema = z.object({
  question: z.string().min(1, 'Question is required').max(10000, 'Question too long'),
  storeNames: z.array(z.string().min(1)).min(1, 'At least one store is required'),
  metadataFilter: z.string().optional(),
  model: z.string().optional()
});

/**
 * POST /api/queries
 * Query File Search Stores and get AI-generated answer with citations
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = QueryRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request',
            details: validationResult.error.issues
          }
        },
        { status: 400 }
      );
    }

    const queryRequest: QueryRequest = validationResult.data;

    // Validate metadata filter syntax if provided
    if (queryRequest.metadataFilter) {
      if (!validateMetadataFilter(queryRequest.metadataFilter)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Invalid metadata filter syntax',
              details: 'Filter must follow the format: key = "value" or key > number'
            }
          },
          { status: 400 }
        );
      }
    }

    // Execute query
    const response = await queryStores(queryRequest);

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    console.error('[POST /api/queries] Error:', error);

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
          message: 'Failed to execute query',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

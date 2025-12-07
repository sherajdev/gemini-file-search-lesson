/**
 * Documents API Route
 *
 * Handles document operations within a File Search Store
 * GET: List all documents in a store
 *
 * IMPORTANT: Next.js 15+ requires awaiting params in dynamic routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { listDocuments } from '@/lib/api/documents';
import { GeminiApiError } from '@/lib/types';

/**
 * GET /api/stores/[storeId]/documents
 * List all documents in a File Search Store
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    // IMPORTANT: Await params in Next.js 15+
    const { storeId } = await params;

    // Construct full store name: "fileSearchStores/{id}"
    const storeName = `fileSearchStores/${storeId}`;

    // List all documents in the store
    const documents = await listDocuments(storeName);

    return NextResponse.json({
      success: true,
      data: { documents }
    });
  } catch (error: any) {
    console.error('[GET /api/stores/:storeId/documents] Error:', error);

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

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to list documents',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

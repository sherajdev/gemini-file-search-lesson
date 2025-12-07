/**
 * Store Detail API Route
 *
 * Handles operations on a specific File Search Store
 * GET: Get store details
 * DELETE: Delete a store
 *
 * IMPORTANT: Next.js 15+ requires awaiting params in dynamic routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStore, deleteStore } from '@/lib/api/stores';
import { GeminiApiError } from '@/lib/types';

/**
 * GET /api/stores/[storeId]
 * Get details of a specific File Search Store
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
    const store = await getStore(storeName);

    return NextResponse.json({
      success: true,
      data: { store }
    });
  } catch (error: any) {
    console.error('[GET /api/stores/:storeId] Error:', error);

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
          message: 'Failed to get store',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/stores/[storeId]
 * Delete a File Search Store (with force: true)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    // IMPORTANT: Await params in Next.js 15+
    const { storeId } = await params;

    // Construct full store name: "fileSearchStores/{id}"
    const storeName = `fileSearchStores/${storeId}`;
    await deleteStore(storeName);

    return NextResponse.json({
      success: true,
      data: { message: 'Store deleted successfully' }
    });
  } catch (error: any) {
    console.error('[DELETE /api/stores/:storeId] Error:', error);

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
          message: 'Failed to delete store',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

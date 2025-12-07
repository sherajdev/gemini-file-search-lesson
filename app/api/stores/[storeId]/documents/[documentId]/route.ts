/**
 * Document Detail API Route
 *
 * Handles operations on a specific document within a File Search Store
 * DELETE: Delete a document from the store
 *
 * IMPORTANT: Next.js 15+ requires awaiting params in dynamic routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteDocument } from '@/lib/api/documents';
import { GeminiApiError } from '@/lib/types';

/**
 * DELETE /api/stores/[storeId]/documents/[documentId]
 * Delete a specific document from a File Search Store
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; documentId: string }> }
) {
  try {
    // IMPORTANT: Await params in Next.js 15+
    const { storeId, documentId } = await params;

    // Construct full document name: "fileSearchStores/{storeId}/documents/{documentId}"
    const documentName = `fileSearchStores/${storeId}/documents/${documentId}`;

    // Delete the document
    await deleteDocument(documentName);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Document deleted successfully'
      }
    });
  } catch (error: any) {
    console.error('[DELETE /api/stores/:storeId/documents/:documentId] Error:', error);

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
          message: 'Failed to delete document',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

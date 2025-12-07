/**
 * Stores API Route
 *
 * Handles CRUD operations for File Search Stores
 * GET: List all stores
 * POST: Create a new store
 */

import { NextRequest, NextResponse } from 'next/server';
import { listStores, createStore } from '@/lib/api/stores';
import { GeminiApiError } from '@/lib/types';
import { z } from 'zod';

// Validation schema for create store request
const CreateStoreSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name too long')
});

/**
 * GET /api/stores
 * List all File Search Stores
 */
export async function GET() {
  try {
    const stores = await listStores();

    return NextResponse.json({
      success: true,
      data: { stores }
    });
  } catch (error: any) {
    console.error('[GET /api/stores] Error:', error);

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
          message: 'Failed to list stores',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stores
 * Create a new File Search Store
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = CreateStoreSchema.safeParse(body);

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

    const { displayName } = validationResult.data;

    // Create the store
    const store = await createStore(displayName);

    return NextResponse.json(
      {
        success: true,
        data: { store }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/stores] Error:', error);

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
          message: 'Failed to create store',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

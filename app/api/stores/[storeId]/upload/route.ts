/**
 * File Upload API Route
 *
 * Handles file uploads to File Search Stores with custom configuration
 * POST: Upload a file to the specified store
 *
 * IMPORTANT: Next.js 15+ requires awaiting params in dynamic routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, validateUploadConfig } from '@/lib/api/uploads';
import { GeminiApiError, UploadFileConfig } from '@/lib/types';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// Validation schema for upload configuration
const UploadConfigSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  chunkingConfig: z.object({
    whiteSpaceConfig: z.object({
      maxTokensPerChunk: z.number().min(200).max(800),
      maxOverlapTokens: z.number().min(20).max(50)
    })
  }).optional(),
  customMetadata: z.array(
    z.object({
      key: z.string().min(1),
      stringValue: z.string().optional(),
      numericValue: z.number().optional()
    })
  ).optional()
});

/**
 * POST /api/stores/[storeId]/upload
 * Upload a file to a File Search Store
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  let tempFilePath: string | null = null;

  try {
    // IMPORTANT: Await params in Next.js 15+
    const { storeId } = await params;

    // Construct full store name: "fileSearchStores/{id}"
    const storeName = `fileSearchStores/${storeId}`;

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const configJson = formData.get('config') as string;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'No file provided',
            details: 'File is required in FormData'
          }
        },
        { status: 400 }
      );
    }

    // Parse and validate config
    let config: UploadFileConfig;
    try {
      const parsedConfig = JSON.parse(configJson);
      const validationResult = UploadConfigSchema.safeParse(parsedConfig);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Invalid configuration',
              details: validationResult.error.issues
            }
          },
          { status: 400 }
        );
      }

      config = validationResult.data;
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid config JSON',
            details: error.message
          }
        },
        { status: 400 }
      );
    }

    // Additional validation
    validateUploadConfig(config);

    // Save file to temporary location
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to avoid conflicts
    const timestamp = Date.now();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    tempFilePath = join('/tmp', `${timestamp}-${safeFilename}`);

    await writeFile(tempFilePath, buffer);

    // Upload file to Gemini
    const operation = await uploadFile(tempFilePath, storeName, config);

    // Clean up temp file
    await unlink(tempFilePath);
    tempFilePath = null;

    return NextResponse.json(
      {
        success: true,
        data: { operation }
      },
      { status: 202 } // 202 Accepted (async operation initiated)
    );
  } catch (error: any) {
    console.error('[POST /api/stores/:storeId/upload] Error:', error);

    // Clean up temp file if it exists
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to clean up temp file:', cleanupError);
      }
    }

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
          message: 'Failed to upload file',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}

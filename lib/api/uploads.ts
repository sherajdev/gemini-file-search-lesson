/**
 * File Upload Operations
 *
 * Handles uploading files to File Search Stores with custom configuration
 * including chunking and metadata.
 *
 * Pattern from: legacy/examples/test-file-search.js:52-58
 */

import { getGeminiClient } from './gemini-client';
import { Operation, UploadFileConfig, GeminiApiError } from '@/lib/types';

/**
 * Upload a file to a File Search Store
 *
 * This function initiates the upload operation. The operation is asynchronous
 * and must be polled using waitForOperation() to track completion.
 *
 * Pattern from test-file-search.js:52-58 and advanced-examples.js:95-120
 *
 * @param {string} filePath - Absolute path to the file to upload
 * @param {string} fileSearchStoreName - Store name (e.g., "fileSearchStores/abc123")
 * @param {UploadFileConfig} config - Upload configuration
 * @returns {Promise<Operation>} The operation object (not yet complete)
 * @throws {GeminiApiError} If upload initiation fails
 */
export async function uploadFile(
  filePath: string,
  fileSearchStoreName: string,
  config: UploadFileConfig
): Promise<Operation> {
  try {
    const ai = getGeminiClient();

    // Build the API config object
    const apiConfig: any = {
      displayName: config.displayName
    };

    // Add chunking config if provided
    if (config.chunkingConfig) {
      apiConfig.chunkingConfig = {
        whiteSpaceConfig: {
          maxTokensPerChunk: config.chunkingConfig.whiteSpaceConfig.maxTokensPerChunk,
          maxOverlapTokens: config.chunkingConfig.whiteSpaceConfig.maxOverlapTokens
        }
      };
    }

    // Add custom metadata if provided
    if (config.customMetadata && config.customMetadata.length > 0) {
      apiConfig.customMetadata = config.customMetadata.map(item => ({
        key: item.key,
        ...(item.stringValue !== undefined ? { stringValue: item.stringValue } : {}),
        ...(item.numericValue !== undefined ? { numericValue: item.numericValue } : {})
      }));
    }

    // Initiate the upload
    const operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: filePath,
      fileSearchStoreName: fileSearchStoreName,
      config: apiConfig
    });

    return operation as Operation;
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to upload file: ${error.message}`,
      500,
      error.response?.data
    );
  }
}

/**
 * Validate upload configuration
 *
 * @param {UploadFileConfig} config - Configuration to validate
 * @throws {GeminiApiError} If configuration is invalid
 */
export function validateUploadConfig(config: UploadFileConfig): void {
  // Validate display name
  if (!config.displayName || config.displayName.trim().length === 0) {
    throw new GeminiApiError('Display name is required', 400);
  }

  // Validate chunking config if provided
  if (config.chunkingConfig) {
    const { maxTokensPerChunk, maxOverlapTokens } = config.chunkingConfig.whiteSpaceConfig;

    if (maxTokensPerChunk < 200 || maxTokensPerChunk > 800) {
      throw new GeminiApiError(
        'maxTokensPerChunk must be between 200 and 800',
        400
      );
    }

    if (maxOverlapTokens < 20 || maxOverlapTokens > 50) {
      throw new GeminiApiError(
        'maxOverlapTokens must be between 20 and 50',
        400
      );
    }

    if (maxOverlapTokens >= maxTokensPerChunk) {
      throw new GeminiApiError(
        'maxOverlapTokens must be less than maxTokensPerChunk',
        400
      );
    }
  }

  // Validate metadata if provided
  if (config.customMetadata) {
    const keys = new Set<string>();

    for (const item of config.customMetadata) {
      // Check for duplicate keys
      if (keys.has(item.key)) {
        throw new GeminiApiError(
          `Duplicate metadata key: ${item.key}`,
          400
        );
      }
      keys.add(item.key);

      // Check that either string or numeric value is provided (not both, not neither)
      const hasString = item.stringValue !== undefined;
      const hasNumeric = item.numericValue !== undefined;

      if (hasString && hasNumeric) {
        throw new GeminiApiError(
          `Metadata key "${item.key}" cannot have both string and numeric values`,
          400
        );
      }

      if (!hasString && !hasNumeric) {
        throw new GeminiApiError(
          `Metadata key "${item.key}" must have either a string or numeric value`,
          400
        );
      }
    }
  }
}

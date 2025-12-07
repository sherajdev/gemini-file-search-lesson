/**
 * Query Operations
 *
 * Handles querying File Search Stores with AI-powered retrieval and citations.
 * Supports multi-store queries and metadata filtering.
 *
 * Pattern from: legacy/examples/test-file-search.js:69-94
 */

import { getGeminiClient } from './gemini-client';
import { QueryRequest, QueryResponse, GeminiApiError, DEFAULT_MODEL } from '@/lib/types';

/**
 * Query File Search Stores with a question
 *
 * Uses the Gemini model with File Search tool to retrieve relevant information
 * from uploaded documents and generate an answer with citations.
 *
 * Pattern from test-file-search.js:69-94 and advanced-examples.js:123-138
 *
 * @param {QueryRequest} request - Query parameters
 * @returns {Promise<QueryResponse>} The answer with grounding metadata
 * @throws {GeminiApiError} If query fails
 */
export async function queryStores(request: QueryRequest): Promise<QueryResponse> {
  try {
    const ai = getGeminiClient();

    // Validate inputs
    if (!request.question || request.question.trim().length === 0) {
      throw new GeminiApiError('Question is required', 400);
    }

    if (!request.storeNames || request.storeNames.length === 0) {
      throw new GeminiApiError('At least one store name is required', 400);
    }

    // Build the file search config
    const fileSearchConfig: any = {
      fileSearchStoreNames: request.storeNames
    };

    // Add metadata filter if provided
    if (request.metadataFilter && request.metadataFilter.trim().length > 0) {
      fileSearchConfig.metadataFilter = request.metadataFilter;
    }

    // Use specified model or default
    const model = request.model || DEFAULT_MODEL;

    // Make the API call
    const response = await ai.models.generateContent({
      model: model,
      contents: request.question,
      config: {
        tools: [
          {
            fileSearch: fileSearchConfig
          }
        ]
      }
    });

    // Extract answer text
    const answer = response.text || '';

    // Extract grounding metadata (citations)
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as any;

    return {
      answer,
      groundingMetadata,
      model
    };
  } catch (error: any) {
    // Check for quota/rate limit errors (429)
    const errorCode = error.response?.data?.error?.code || error.code;
    const errorMessage = error.response?.data?.error?.message || error.message;
    const errorStatus = error.response?.data?.error?.status;

    // Handle quota exceeded errors specifically
    if (errorCode === 429 || errorStatus === 'RESOURCE_EXHAUSTED') {
      // Check if it's a free tier limit for a paid model
      if (errorMessage?.includes('free_tier') && errorMessage?.includes('limit: 0')) {
        throw new GeminiApiError(
          'This model requires a paid API key. Please upgrade your API key or select a different model (Gemini 2.5 Flash, Pro, or Flash Lite).',
          429,
          error.response?.data
        );
      }

      // General quota exceeded error
      throw new GeminiApiError(
        'API quota exceeded. Please try again later or upgrade your API plan.',
        429,
        error.response?.data
      );
    }

    // Default error handling
    throw new GeminiApiError(
      `Failed to query stores: ${errorMessage}`,
      errorCode || 500,
      error.response?.data
    );
  }
}

/**
 * Validate metadata filter syntax
 *
 * Basic validation for metadata filter strings.
 * Full syntax: https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata
 *
 * @param {string} filter - The metadata filter string
 * @returns {boolean} True if filter appears valid
 */
export function validateMetadataFilter(filter: string): boolean {
  if (!filter || filter.trim().length === 0) {
    return true; // Empty filter is valid (no filtering)
  }

  // Basic syntax check for common patterns
  // Examples: 'category = "electronics"', 'year > 2023', 'category = "electronics" AND year > 2023'
  const validPattern = /^[\w\s]+(=|!=|>|<|>=|<=)\s*("[^"]*"|\d+)(\s+(AND|OR)\s+[\w\s]+(=|!=|>|<|>=|<=)\s*("[^"]*"|\d+))*$/;

  return validPattern.test(filter.trim());
}

/**
 * Extract citations from grounding metadata
 *
 * Simplifies the grounding metadata structure into a more usable format
 * for displaying citations in the UI.
 *
 * @param {any} groundingMetadata - The grounding metadata from the response
 * @returns {Array} Simplified citation objects
 */
export function extractCitations(groundingMetadata: any): any[] {
  if (!groundingMetadata?.groundingChunks) {
    return [];
  }

  return groundingMetadata.groundingChunks.map((chunk: any, index: number) => {
    return {
      id: index,
      text: chunk.retrievedContext?.text || '',
      title: chunk.retrievedContext?.title || 'Untitled',
      uri: chunk.retrievedContext?.uri || '',
      // Include original chunk for advanced features
      raw: chunk
    };
  });
}

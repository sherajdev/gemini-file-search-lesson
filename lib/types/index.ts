/**
 * TypeScript Types for Gemini File Search API
 *
 * These types define the shape of data structures used throughout the application
 * for interacting with the Gemini File Search API.
 */

// ============================================================================
// Store Types
// ============================================================================

export interface Store {
  name: string;
  displayName: string;
  createTime?: string;
  updateTime?: string;
}

export interface CreateStoreRequest {
  displayName: string;
}

export interface DeleteStoreRequest {
  name: string;
  force?: boolean;
}

// ============================================================================
// File Upload Types
// ============================================================================

export interface ChunkingConfig {
  whiteSpaceConfig: {
    maxTokensPerChunk: number;
    maxOverlapTokens: number;
  };
}

export interface CustomMetadataItem {
  key: string;
  stringValue?: string;
  numericValue?: number;
}

export interface UploadFileConfig {
  displayName: string;
  chunkingConfig?: ChunkingConfig;
  customMetadata?: CustomMetadataItem[];
}

export interface UploadFileRequest {
  filePath: string;
  fileSearchStoreName: string;
  config: UploadFileConfig;
}

// ============================================================================
// Document Types
// ============================================================================

export type DocumentState = 'PENDING' | 'ACTIVE' | 'FAILED';

export interface Document {
  name: string;
  displayName: string;
  state: DocumentState;
  sizeBytes?: number;
  mimeType?: string;
  createTime?: string;
  updateTime?: string;
  customMetadata?: CustomMetadataItem[];
}

export interface ListDocumentsResponse {
  documents: Document[];
}

export interface GetDocumentResponse {
  document: Document;
}

export interface DeleteDocumentResponse {
  success: boolean;
}

// ============================================================================
// Operation Types
// ============================================================================

export interface Operation {
  name: string;
  done: boolean;
  metadata?: {
    '@type': string;
    [key: string]: any;
  };
  response?: {
    '@type': string;
    [key: string]: any;
  };
  error?: {
    code: number;
    message: string;
    details?: any[];
  };
}

// ============================================================================
// Query Types
// ============================================================================

export interface FileSearchTool {
  fileSearch: {
    fileSearchStoreNames: string[];
    metadataFilter?: string;
  };
}

export interface QueryConfig {
  tools: FileSearchTool[];
}

export interface QueryRequest {
  question: string;
  storeNames: string[];
  metadataFilter?: string;
  model?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
    text?: string;
  };
}

export interface GroundingSupport {
  segment?: {
    startIndex?: number;
    endIndex?: number;
    text?: string;
  };
  groundingChunkIndices?: number[];
  confidenceScores?: number[];
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  groundingSupports?: GroundingSupport[];
  webSearchQueries?: string[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
  retrievalMetadata?: {
    googleSearchDynamicRetrievalScore?: number;
  };
}

export interface QueryResponse {
  answer: string;
  groundingMetadata?: GroundingMetadata;
  model: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  success: boolean;
}

export interface ListStoresResponse {
  stores: Store[];
}

export interface CreateStoreResponse {
  store: Store;
}

export interface GetStoreResponse {
  store: Store;
}

export interface DeleteStoreResponse {
  success: boolean;
}

export interface UploadFileResponse {
  operation: Operation;
}

export interface GetOperationResponse {
  operation: Operation;
}

// ============================================================================
// Error Types
// ============================================================================

export class GeminiApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

// ============================================================================
// Utility Types
// ============================================================================

export interface ChunkingPreset {
  name: 'small' | 'medium' | 'large';
  maxTokensPerChunk: number;
  maxOverlapTokens: number;
  description: string;
}

export const CHUNKING_PRESETS: Record<ChunkingPreset['name'], ChunkingPreset> = {
  small: {
    name: 'small',
    maxTokensPerChunk: 200,
    maxOverlapTokens: 20,
    description: 'Precise retrieval with smaller context windows'
  },
  medium: {
    name: 'medium',
    maxTokensPerChunk: 400,
    maxOverlapTokens: 30,
    description: 'Balanced approach (recommended)'
  },
  large: {
    name: 'large',
    maxTokensPerChunk: 512,
    maxOverlapTokens: 50,
    description: 'Maximum context per chunk (API limit)'
  }
};

// Export model configuration from centralized config file
export { DEFAULT_MODEL, GEMINI_MODELS, type GeminiModel } from '@/lib/config/models';

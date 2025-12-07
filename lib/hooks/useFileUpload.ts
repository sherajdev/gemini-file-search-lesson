import { useState, useCallback } from 'react';
import { useOperationPolling } from './useOperationPolling';

interface ChunkingConfig {
  maxTokensPerChunk?: number;
  maxOverlapTokens?: number;
}

interface CustomMetadata {
  [key: string]: string | number;
}

interface UploadConfig {
  displayName?: string;
  chunkingConfig?: ChunkingConfig;
  customMetadata?: CustomMetadata;
}

interface UseFileUploadResult {
  uploadFile: (storeId: string, file: File, config?: UploadConfig) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadSuccess: boolean;
  reset: () => void;
}

/**
 * Hook for uploading files to a File Search Store
 * Handles FormData creation, upload request, and operation polling
 *
 * Usage:
 * const { uploadFile, isUploading, uploadProgress, uploadError } = useFileUpload();
 * await uploadFile(storeId, file, { displayName, chunkingConfig, customMetadata });
 */
export function useFileUpload(): UseFileUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const {
    status,
    isPolling,
    error: pollingError,
    progress,
    startPolling,
  } = useOperationPolling();

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
  }, []);

  const uploadFile = useCallback(async (
    storeId: string,
    file: File,
    config: UploadConfig = {}
  ) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Transform config to API format
      const apiConfig: any = {
        displayName: config.displayName || file.name,
      };

      // Transform chunking config to have whiteSpaceConfig wrapper
      if (config.chunkingConfig) {
        apiConfig.chunkingConfig = {
          whiteSpaceConfig: {
            maxTokensPerChunk: config.chunkingConfig.maxTokensPerChunk || 400,
            maxOverlapTokens: config.chunkingConfig.maxOverlapTokens || 30,
          },
        };
      }

      // Transform metadata from object to array format
      if (config.customMetadata && Object.keys(config.customMetadata).length > 0) {
        apiConfig.customMetadata = Object.entries(config.customMetadata).map(([key, value]) => {
          if (typeof value === 'number') {
            return { key, numericValue: value };
          } else {
            return { key, stringValue: String(value) };
          }
        });
      }

      // Append config as JSON string
      formData.append('config', JSON.stringify(apiConfig));

      // Upload file
      const response = await fetch(`/api/stores/${encodeURIComponent(storeId)}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Properly extract error message
        const errorMessage = errorData.error?.message || errorData.error || 'Failed to upload file';
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Check if operation is already complete
      const operation = data.data?.operation;
      if (!operation?.name) {
        throw new Error('No operation name returned from upload');
      }

      // If operation already has a response, it's done (no need to poll)
      if (operation.response || operation.done) {
        setUploadSuccess(true);
        setIsUploading(false);
      } else {
        // Start polling operation
        startPolling(operation.name);
      }

    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload file');
      setIsUploading(false);
    }
  }, [startPolling]);

  // Update states based on polling status
  const uploadProgress = isPolling ? progress : 0;
  const finalError = uploadError || pollingError;

  // Check if upload is complete
  if (status?.done && !status.error && isUploading) {
    setUploadSuccess(true);
    setIsUploading(false);
  }

  if (status?.error && isUploading) {
    setUploadError(status.error.message || 'Upload failed');
    setIsUploading(false);
  }

  return {
    uploadFile,
    isUploading: isUploading || isPolling,
    uploadProgress,
    uploadError: finalError,
    uploadSuccess,
    reset,
  };
}

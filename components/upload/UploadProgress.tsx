'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  fileName?: string;
}

export function UploadProgress({
  isUploading,
  progress,
  error,
  success,
  fileName,
}: UploadProgressProps) {
  if (!isUploading && !error && !success) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Status Message */}
      <div className="flex items-center gap-3">
        {isUploading && (
          <>
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {fileName ? `Uploading ${fileName}...` : 'Uploading file...'}
              </p>
              <p className="text-xs text-gray-500">
                {progress < 30
                  ? 'Uploading file to server...'
                  : progress < 70
                  ? 'Processing and chunking document...'
                  : 'Finalizing upload...'}
              </p>
            </div>
          </>
        )}

        {success && (
          <>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">Upload complete!</p>
              <p className="text-xs text-gray-500">
                {fileName ? `${fileName} has been uploaded successfully` : 'File uploaded successfully'}
              </p>
            </div>
          </>
        )}

        {error && (
          <>
            <XCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Upload failed</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

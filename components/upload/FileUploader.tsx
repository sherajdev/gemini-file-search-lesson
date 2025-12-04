'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FileUploaderProps {
  selectedFile: File | null;
  displayName: string;
  onFileSelect: (file: File | null) => void;
  onDisplayNameChange: (name: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ACCEPTED_FILE_TYPES = {
  'text/*': ['.txt', '.md', '.csv'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/json': ['.json'],
  'text/html': ['.html'],
  'text/plain': ['.txt'],
};

export function FileUploader({
  selectedFile,
  displayName,
  onFileSelect,
  onDisplayNameChange,
  disabled = false,
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File is too large. Maximum size is 100MB.');
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a text, PDF, or document file.');
        } else {
          setError('Failed to upload file. Please try again.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);

        // Auto-fill display name if empty
        if (!displayName) {
          onDisplayNameChange(file.name);
        }
      }
    },
    [onFileSelect, onDisplayNameChange, displayName]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    disabled,
  });

  const handleRemoveFile = () => {
    onFileSelect(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-900 mb-1">
            {isDragActive ? 'Drop your file here' : 'Drag and drop your file here'}
          </p>
          <p className="text-xs text-gray-500 mb-4">or click to browse files</p>
          <p className="text-xs text-gray-400">
            Supported: PDF, TXT, MD, DOC, DOCX, JSON, HTML (max 100MB)
          </p>
        </div>
      ) : (
        /* Selected File Preview */
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <File className="h-10 w-10 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Display Name Input */}
      {selectedFile && (
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <Input
            id="displayName"
            type="text"
            placeholder="Enter a display name for this file"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1">
            This name will be shown in search results and citations
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

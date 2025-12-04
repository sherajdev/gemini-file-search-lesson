'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUploader } from '@/components/upload/FileUploader';
import { ChunkingConfigurator } from '@/components/upload/ChunkingConfigurator';
import { MetadataEditor } from '@/components/upload/MetadataEditor';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { useFileUpload } from '@/lib/hooks/useFileUpload';
import { use } from 'react';

interface PageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default function UploadPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { storeId } = resolvedParams;
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [chunkingConfig, setChunkingConfig] = useState({
    maxTokensPerChunk: 400,
    maxOverlapTokens: 30,
  });
  const [customMetadata, setCustomMetadata] = useState<Record<string, string | number>>({});

  const { uploadFile, isUploading, uploadProgress, uploadError, uploadSuccess, reset } =
    useFileUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      return;
    }

    await uploadFile(storeId, selectedFile, {
      displayName: displayName || selectedFile.name,
      chunkingConfig,
      customMetadata: Object.keys(customMetadata).length > 0 ? customMetadata : undefined,
    });
  };

  const handleUploadAnother = () => {
    reset();
    setSelectedFile(null);
    setDisplayName('');
    setChunkingConfig({ maxTokensPerChunk: 400, maxOverlapTokens: 30 });
    setCustomMetadata({});
  };

  const handleGoToQuery = () => {
    router.push(`/stores/${storeId}/query`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/stores/${storeId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Upload File</h1>
        <p className="text-gray-600 mt-1">
          Upload a document to the store with custom chunking and metadata
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Selection */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select File</h2>
            <FileUploader
              selectedFile={selectedFile}
              displayName={displayName}
              onFileSelect={setSelectedFile}
              onDisplayNameChange={setDisplayName}
              disabled={isUploading}
            />
          </div>
        </Card>

        {/* Chunking Configuration */}
        {selectedFile && (
          <Card>
            <div className="p-6">
              <ChunkingConfigurator config={chunkingConfig} onChange={setChunkingConfig} />
            </div>
          </Card>
        )}

        {/* Metadata Editor */}
        {selectedFile && (
          <Card>
            <div className="p-6">
              <MetadataEditor metadata={customMetadata} onChange={setCustomMetadata} />
            </div>
          </Card>
        )}

        {/* Upload Progress */}
        {(isUploading || uploadError || uploadSuccess) && (
          <Card>
            <div className="p-6">
              <UploadProgress
                isUploading={isUploading}
                progress={uploadProgress}
                error={uploadError}
                success={uploadSuccess}
                fileName={selectedFile?.name}
              />
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {!uploadSuccess && (
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-2"
            >
              <UploadIcon className="h-5 w-5" />
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push(`/stores/${storeId}`)}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Success Actions */}
        {uploadSuccess && (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleGoToQuery}
              className="flex items-center gap-2"
            >
              Query This Store
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleUploadAnother}
            >
              Upload Another File
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

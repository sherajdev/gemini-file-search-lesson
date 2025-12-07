import { Document } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { formatFileSize, formatRelativeTime, getFileIcon } from '@/lib/utils/formatters';
import {
  File,
  FileText,
  FileCode,
  Image,
  Video,
  Music,
  Trash2,
  CheckCircle,
  Loader,
  XCircle,
} from 'lucide-react';

interface DocumentItemProps {
  document: Document;
  onDelete: () => void;
}

/**
 * Get icon component based on file type
 */
function getIconComponent(mimeType: string | undefined) {
  const iconName = getFileIcon(mimeType);
  const iconClass = "w-5 h-5 text-blue-600";

  switch (iconName) {
    case 'FileText':
      return <FileText className={iconClass} />;
    case 'FileCode':
      return <FileCode className={iconClass} />;
    case 'Image':
      return <Image className={iconClass} />;
    case 'Video':
      return <Video className={iconClass} />;
    case 'Music':
      return <Music className={iconClass} />;
    default:
      return <File className={iconClass} />;
  }
}

/**
 * Get state badge configuration based on document state
 */
function getStateBadge(state: 'PENDING' | 'ACTIVE' | 'FAILED') {
  switch (state) {
    case 'PENDING':
      return {
        label: 'Processing',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Loader className="w-3 h-3 animate-spin" />,
      };
    case 'ACTIVE':
      return {
        label: 'Ready',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-3 h-3" />,
      };
    case 'FAILED':
      return {
        label: 'Failed',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="w-3 h-3" />,
      };
  }
}

/**
 * DocumentItem Component
 *
 * Displays a single document with metadata and actions
 */
export function DocumentItem({ document, onDelete }: DocumentItemProps) {
  const badge = getStateBadge(document.state);
  const isPending = document.state === 'PENDING';
  const isActive = document.state === 'ACTIVE';
  const canDelete = document.state === 'FAILED'; // Only allow deletion of failed documents

  let deleteTooltip = 'Delete document';
  if (isPending) {
    deleteTooltip = 'Cannot delete while processing';
  } else if (isActive) {
    deleteTooltip = 'Active documents cannot be deleted. Delete the entire store instead.';
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      {/* Left: Icon + Metadata */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* File Icon */}
        <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
          {getIconComponent(document.mimeType)}
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          {/* Display Name + State Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate" title={document.displayName}>
              {document.displayName}
            </h4>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}
            >
              {badge.icon}
              {badge.label}
            </span>
          </div>

          {/* File Size + Upload Date */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>{formatFileSize(document.sizeBytes)}</span>
            <span className="text-gray-400">•</span>
            <span>{formatRelativeTime(document.createTime)}</span>
            {document.mimeType && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500 truncate max-w-[200px]" title={document.mimeType}>
                  {document.mimeType}
                </span>
              </>
            )}
          </div>

          {/* Custom Metadata (if present) */}
          {document.customMetadata && document.customMetadata.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {document.customMetadata.map((meta, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                >
                  <span className="font-medium">{meta.key}:</span>
                  <span>{meta.stringValue || meta.numericValue}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Delete Button */}
      <div className="flex-shrink-0 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={!canDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title={deleteTooltip}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

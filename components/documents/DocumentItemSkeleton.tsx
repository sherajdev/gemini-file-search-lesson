import { Skeleton } from '@/components/ui/Skeleton';

/**
 * DocumentItemSkeleton Component
 *
 * Loading skeleton for DocumentItem while documents are being fetched.
 * Matches the structure of DocumentItem for seamless loading transition.
 */
export function DocumentItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
      {/* Left: Icon + Metadata */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* File Icon */}
        <Skeleton width="10" height="10" rounded="lg" className="flex-shrink-0" />

        {/* Document Info */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Display Name + State Badge */}
          <div className="flex items-center gap-2">
            <Skeleton width="48" height="5" />
            <Skeleton width="16" height="5" rounded="full" />
          </div>

          {/* File Size + Upload Date */}
          <div className="flex items-center gap-3">
            <Skeleton width="16" height="4" />
            <Skeleton width="1" height="4" />
            <Skeleton width="20" height="4" />
            <Skeleton width="1" height="4" />
            <Skeleton width="24" height="4" />
          </div>

          {/* Metadata tags (optional) */}
          <div className="flex flex-wrap gap-1">
            <Skeleton width="20" height="5" rounded="md" />
            <Skeleton width="16" height="5" rounded="md" />
          </div>
        </div>
      </div>

      {/* Right: Delete Button */}
      <div className="flex-shrink-0 ml-4">
        <Skeleton width="10" height="8" rounded="md" />
      </div>
    </div>
  );
}

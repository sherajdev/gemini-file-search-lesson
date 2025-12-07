import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';

interface CitationCardSkeletonProps {
  index: number;
}

function CitationCardSkeleton({ index }: CitationCardSkeletonProps) {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Skeleton width="8" height="8" rounded="full" className="flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton width="4" height="4" />
              <Skeleton width="48" height="4" />
            </div>
            <Skeleton width="32" height="3" />
          </div>
        </div>

        {/* Snippet Preview */}
        <div className="mb-3 space-y-2">
          <Skeleton width="full" height="3" />
          <Skeleton width="full" height="3" />
          <Skeleton width="3/4" height="3" />
        </div>

        {/* Expand Button Placeholder */}
        <Skeleton width="24" height="8" />
      </div>
    </Card>
  );
}

interface CitationListSkeletonProps {
  className?: string;
  count?: number;
}

/**
 * CitationListSkeleton Component
 *
 * Loading skeleton for CitationList while query is processing.
 * Matches the structure of CitationList for seamless loading transition.
 */
export function CitationListSkeleton({ className, count = 3 }: CitationListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton width="24" height="6" className="mb-2" />
          <Skeleton width="32" height="4" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <CitationCardSkeleton key={index} index={index} />
        ))}
      </div>
    </div>
  );
}

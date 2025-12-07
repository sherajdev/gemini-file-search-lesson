import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * StoreCardSkeleton Component
 *
 * Loading skeleton for StoreCard while stores are being fetched.
 * Matches the structure of StoreCard for seamless loading transition.
 */
export function StoreCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon placeholder */}
            <Skeleton width="10" height="10" rounded="lg" />

            <div className="flex-1">
              {/* Title */}
              <Skeleton width="32" height="5" className="mb-2" />
              {/* Created date */}
              <Skeleton width="24" height="3" />
            </div>
          </div>

          {/* Delete button placeholder */}
          <Skeleton width="8" height="8" rounded="md" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {/* View Details button */}
          <Skeleton width="full" height="10" rounded="md" />

          {/* Upload File button */}
          <Skeleton width="full" height="10" rounded="md" />

          {/* Query Store button */}
          <Skeleton width="full" height="10" rounded="md" />
        </div>

        {/* Store ID section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Skeleton width="40" height="3" />
        </div>
      </CardContent>
    </Card>
  );
}

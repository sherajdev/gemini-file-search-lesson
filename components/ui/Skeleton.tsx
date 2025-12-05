import { cn } from "@/lib/utils/cn";

export interface SkeletonProps {
  width?: "full" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4" | string;
  height?: "2" | "3" | "4" | "6" | "8" | "10" | "12" | "16" | "20" | "24" | "32" | string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
  variant?: "pulse" | "shimmer";
}

export function Skeleton({
  width = "full",
  height = "4",
  rounded = "md",
  className,
  variant = "pulse",
}: SkeletonProps) {
  const widthClass = width.startsWith("w-") ? width : `w-${width}`;
  const heightClass = height.startsWith("h-") ? height : `h-${height}`;
  const roundedClass = rounded === "none" ? "" : `rounded-${rounded}`;
  const animation = variant === "shimmer" ? "animate-shimmer" : "animate-pulse";

  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        widthClass,
        heightClass,
        roundedClass,
        animation,
        className
      )}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "2/3" : "full"}
          height="3"
          className="bg-gray-200 dark:bg-gray-700"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700",
        className
      )}
      aria-hidden="true"
    >
      <Skeleton width="3/4" height="6" className="mb-3" />
      <Skeleton width="full" height="4" className="mb-2" />
      <Skeleton width="2/3" height="4" className="mb-4" />
      <div className="flex gap-2 mt-4">
        <Skeleton width="20" height="10" rounded="md" />
        <Skeleton width="20" height="10" rounded="md" />
      </div>
    </div>
  );
}

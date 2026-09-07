/**
 * Placeholders that hold the shape of what is still loading.
 *
 * A spinner says something is happening and nothing about what; a placeholder
 * on the same box, radius and rhythm as the content means nothing moves when
 * the content lands. Each block is hidden from screen readers and the region
 * around it announces the wait once, so a reader is told "loading" rather than
 * read a row of empty boxes.
 */

export const Skeleton = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`block rounded-sm bg-asphalt-200 placeholder-pulse ${className}`}
  />
);

/** Wraps a loading region so the wait is announced once. */
export const SkeletonRegion = ({ label, children, className = "" }) => (
  <div role="status" aria-busy="true" aria-live="polite" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

/** One order row, on the same box as OrderCard. */
export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-asphalt-200 shadow-track p-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-7 w-52 mb-2" />
            <div className="mb-3 space-y-1">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-24 mt-2" />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-24 rounded-pill" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between lg:justify-end gap-4">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  </div>
);

/** A figure tile, on the same box as StatCard. */
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-track border border-asphalt-200">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-md" />
      <div className="flex-1">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

/** A panel of rows, on the same box as the list it replaces. */
export const ListPanelSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg p-6 shadow-track border border-asphalt-200">
    <Skeleton className="h-5 w-40 mb-4" />
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-5 w-full" />
      ))}
    </div>
  </div>
);

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl ring-1 ring-foreground/10 bg-card p-4 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-2/5 rounded bg-muted" />
          <div className="h-3 w-4/5 rounded bg-muted" />
        </div>
        {/* vote button skeleton */}
        <div className="flex flex-col items-center gap-1 px-1.5 py-1">
          <div className="size-6 rounded bg-muted" />
          <div className="h-4 w-6 rounded bg-muted" />
          <div className="size-6 rounded bg-muted" />
        </div>
      </div>
      {/* tags */}
      <div className="flex gap-2">
        <div className="h-5 w-12 rounded-full bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-10 rounded-full bg-muted" />
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 4 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

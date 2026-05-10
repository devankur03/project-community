import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Compass } from "lucide-react";

export default function ExploreLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
          <Compass className="size-7 text-primary" />
          Explore
        </h1>
        <div className="h-4 w-96 rounded bg-muted animate-pulse" />
      </div>

      {/* Search + sort skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6 animate-pulse">
        <div className="h-9 flex-1 rounded-lg bg-muted" />
        <div className="flex gap-1.5">
          <div className="h-9 w-24 rounded-lg bg-muted" />
          <div className="h-9 w-16 rounded-lg bg-muted" />
        </div>
      </div>

      {/* Filter by label + tag pills skeleton */}
      <div className="flex flex-col gap-2 mb-6 animate-pulse">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-6 w-14 rounded-full bg-muted" />
          ))}
        </div>
      </div>

      {/* Result count skeleton */}
      <div className="h-4 w-24 rounded bg-muted mb-6 animate-pulse" />

      {/* Product card grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

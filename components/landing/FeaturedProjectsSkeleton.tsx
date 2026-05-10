import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export function FeaturedProjectsSkeleton() {
  return (
    <section>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
            <Flame className="size-6 text-primary" />
            Featured Today
          </h2>
          <p className="text-sm text-muted-foreground">
            Hand-picked projects the community is talking about right now.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0 mt-1" disabled>
          View all
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
      <ProductGridSkeleton count={4} />
    </section>
  );
}

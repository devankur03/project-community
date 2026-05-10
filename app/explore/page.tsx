import { Compass } from "lucide-react";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/products/product-select";
import { ProductGrid } from "@/components/explore/ProductGrid";

async function ExploreContent() {
  const products = await getAllProducts();
  // Derive sorted unique tags from all products
  const allTags = Array.from(
    new Set(products.flatMap((p) => p.tags))
  ).sort();

  return <ProductGrid products={products} allTags={allTags} />;
}

export default function ExplorePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
          <Compass className="size-7 text-primary" />
          Explore
        </h1>
        <p className="text-muted-foreground">
          Browse all products submitted by the community. Search, filter by tag, or sort to find what you&apos;re looking for.
        </p>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
        <ExploreContent />
      </Suspense>
    </div>
  );
}

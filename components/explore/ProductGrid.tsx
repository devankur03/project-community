"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { VoteButton } from "@/components/ui/VoteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageOpen } from "lucide-react";
import type { Product } from "@/db/schema";

type SortOption = "votes" | "latest";

interface ProductGridProps {
  products: Product[];
  allTags: string[];
}

export function ProductGrid({ products, allTags }: ProductGridProps) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("votes");

  const filtered = useMemo(() => {
    let result = products;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagLine.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    if (sort === "votes") {
      result = [...result].sort((a, b) => b.voteCount - a.voteCount);
    } else {
      result = [...result].sort(
        (a, b) =>
          new Date(b.approvedAt ?? b.createdAt).getTime() -
          new Date(a.approvedAt ?? a.createdAt).getTime()
      );
    }

    return result;
  }, [products, query, selectedTag, sort]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products by name, tagline or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex gap-1.5 shrink-0">
          <Button
            size="sm"
            variant={sort === "votes" ? "default" : "outline"}
            onClick={() => setSort("votes")}
          >
            Most Voted
          </Button>
          <Button
            size="sm"
            variant={sort === "latest" ? "default" : "outline"}
            onClick={() => setSort("latest")}
          >
            Latest
          </Button>
        </div>
      </div>

      {/* Tag filters */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Filter by</span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
            selectedTag === null
              ? "bg-primary text-primary-foreground ring-primary"
              : "bg-muted text-muted-foreground ring-border hover:bg-accent hover:text-foreground"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
              selectedTag === tag
                ? "bg-primary text-primary-foreground ring-primary"
                : "bg-muted text-muted-foreground ring-border hover:bg-accent hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        {selectedTag ? ` tagged "${selectedTag}"` : ""}
        {query ? ` matching "${query}"` : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No products found"
          description="Try adjusting your search or clearing the filters."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`} className="group">
              <Card className="shadow-md group-hover:shadow-lg transition-shadow duration-200 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.tagLine}</CardDescription>
                    </div>
                    <VoteButton productId={item.id} initialVotes={item.voteCount} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedTag(selectedTag === tag ? null : tag);
                        }}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors ${
                          selectedTag === tag
                            ? "bg-primary text-primary-foreground ring-primary"
                            : "bg-primary/10 text-primary ring-primary/20 hover:bg-primary/20"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

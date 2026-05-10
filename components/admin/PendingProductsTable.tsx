"use client";

import { useTransition } from "react";
import { reviewProduct } from "@/lib/products/product-actions";
import type { Product } from "@/db/schema";
import { CheckCircle, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PendingProductsTableProps {
    products: Product[];
}

export function PendingProductsTable({ products }: PendingProductsTableProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                <CheckCircle className="size-10 text-primary/40 mb-3" />
                <p className="text-base font-medium text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground">No products are waiting for review.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
            {products.map((product) => (
                <PendingRow key={product.id} product={product} />
            ))}
        </div>
    );
}

function PendingRow({ product }: { product: Product }) {
    const [isPending, startTransition] = useTransition();

    function handle(action: "approved" | "rejected") {
        startTransition(() => reviewProduct(product.id, action));
    }

    return (
        <div className="flex items-start justify-between gap-4 px-5 py-4 bg-card hover:bg-muted/30 transition-colors">
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{product.name}</span>
                    <Link
                        href={product.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="size-3.5" />
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground truncate">{product.tagLine}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {product.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Submitted {new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-0.5">
                {isPending ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handle("rejected")}
                        >
                            <XCircle className="size-4" />
                            Reject
                        </Button>
                        <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handle("approved")}
                        >
                            <CheckCircle className="size-4" />
                            Approve
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

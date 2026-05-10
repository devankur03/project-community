"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle, Clock, XCircle, Trash2, Loader2 } from "lucide-react";
import type { Product } from "@/db/schema";
import { deleteProduct } from "@/lib/products/product-actions";
import { Button } from "@/components/ui/button";

interface AllProductsTableProps {
    products: Product[];
}

const STATUS_CONFIG = {
    approved: {
        label: "Approved",
        icon: CheckCircle,
        className: "bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20",
    },
    pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-yellow-500/20",
    },
    rejected: {
        label: "Rejected",
        icon: XCircle,
        className: "bg-destructive/10 text-destructive ring-destructive/20",
    },
} as const;

export function AllProductsTable({ products }: AllProductsTableProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                <p className="text-base font-medium text-foreground">No products yet.</p>
                <p className="text-sm text-muted-foreground">Submitted products will appear here.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
            {products.map((product) => (
                <ProductRow key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductRow({ product }: { product: Product }) {
    const { label, icon: Icon, className } = STATUS_CONFIG[product.status];
    const [isPending, startTransition] = useTransition();
    const [confirming, setConfirming] = useState(false);

    function handleDelete() {
        if (!confirming) {
            setConfirming(true);
            return;
        }
        setConfirming(false);
        startTransition(() => deleteProduct(product.id));
    }

    return (
        <div className="flex items-start justify-between gap-4 px-5 py-4 bg-card hover:bg-muted/30 transition-colors">
            {/* Left: product info */}
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
                    {" · "}{product.voteCount} votes
                </p>
            </div>

            {/* Right: status + delete */}
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
                {isPending ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
                            <Icon className="size-3" />
                            {label}
                        </span>
                        {confirming ? (
                            <>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1.5"
                                    onClick={handleDelete}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setConfirming(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}


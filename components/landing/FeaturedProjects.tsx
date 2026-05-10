'use cache';

import { Flame, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { VoteButton } from "@/components/ui/VoteButton";
import { getFeaturedProducts } from "@/lib/products/product-select";

export async function FeaturedProjects() {
    const products = await getFeaturedProducts();

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
                <Button variant="outline" size="sm" className="gap-1.5 shrink-0 mt-1" asChild>
                    <Link href="/explore">
                        View all
                        <ArrowRight className="size-3.5" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {products.map((item) => (
                    <Link key={item.id} href={`/product/${item.id}`} className="group">
                        <Card className="shadow-md group-hover:shadow-lg transition-shadow duration-200 h-full">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle>{item.name}</CardTitle>
                                        </div>
                                        <CardDescription>{item.tagLine}</CardDescription>
                                    </div>
                                    <VoteButton productId={item.id} initialVotes={item.voteCount} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}

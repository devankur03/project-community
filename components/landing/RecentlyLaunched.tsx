import { Rocket, ArrowRight, PackageOpen } from "lucide-react";
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
import { EmptyState } from "@/components/ui/EmptyState";
import { getRecentlyLaunchedProducts } from "@/lib/products/product-select";
import { connection } from "next/server";

export async function RecentlyLaunched() {
  await connection();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentlyLaunched = await getRecentlyLaunchedProducts(oneWeekAgo);
  return (
    <section>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
            <Rocket className="size-6 text-primary" />
            Recently Launched
          </h2>
          <p className="text-sm text-muted-foreground">
            Fresh projects just submitted by the community.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0 mt-1" asChild>
          <Link href="/explore">
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {recentlyLaunched.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No launches yet"
          description="Be the first to share your project with the community."
          action={{ label: "Submit your project", icon: Rocket }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {recentlyLaunched.map((item) => (
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
      )}
    </section>
  );
}

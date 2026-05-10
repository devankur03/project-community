import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CalendarDays, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoteButton } from "@/components/ui/VoteButton";
import { getProductById } from "@/lib/products/product-select";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const id = Number(productId);

  if (isNaN(id)) notFound();

  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      {/* Back */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="text-lg text-muted-foreground">{product.tagLine}</p>
        </div>
        <VoteButton productId={product.id} initialVotes={product.voteCount} />
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Visit button */}
      <div className="mt-6">
        <Button asChild>
          <a href={product.webUrl} target="_blank" rel="noopener noreferrer">
            Visit Website
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </div>

      {/* Divider */}
      <hr className="my-8 border-border" />

      {/* Description */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold text-foreground mb-3">About</h2>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      {/* Meta */}
      <div className="mt-8 flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="size-4" />
          <span>Submitted by <span className="text-foreground font-medium">{product.submittedBy}</span></span>
        </div>
        {product.approvedAt && (
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            <span>
              Launched on{" "}
              <span className="text-foreground font-medium">
                {new Date(product.approvedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

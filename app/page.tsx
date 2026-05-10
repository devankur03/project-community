import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { RecentlyLaunched } from "@/components/landing/RecentlyLaunched";
import { FeaturedProjectsSkeleton } from "@/components/landing/FeaturedProjectsSkeleton";
import { RecentlyLaunchedSkeleton } from "@/components/landing/RecentlyLaunchedSkeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-background font-sans">

      {/* Hero + Stats — full-width background band */}
      <div className="relative w-full overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.52_0.2_145/0.18),transparent)] border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.52 0.2 145) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto w-full max-w-4xl px-6 py-20">
          <HeroSection />
          <StatsSection />
        </div>
      </div>

      {/* Main content */}
      {/* Featured Projects — subtle green tint */}
      <div className="w-full border-b border-border bg-primary/5">
        <div className="mx-auto w-full max-w-4xl px-6 py-16">
          <Suspense fallback={<FeaturedProjectsSkeleton />}>
            <FeaturedProjects />
          </Suspense>
        </div>
      </div>

      {/* Recently Launched — soft neutral/muted band */}
      <div className="w-full bg-muted/40">
        <div className="mx-auto w-full max-w-4xl px-6 py-16">
          <Suspense fallback={<RecentlyLaunchedSkeleton />}>
            <RecentlyLaunched />
          </Suspense>
        </div>
      </div>

    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Upload, Compass } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="flex flex-col items-center text-center gap-6 mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                Now in public beta
            </span>
            <h1 className="max-w-2xl text-5xl font-bold tracking-tight leading-[1.15] text-foreground">
                Share what you&apos;ve built and discover{" "}
                <span className="text-primary">what&apos;s launching</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                A space for developers, designers, and makers to showcase their work,
                get feedback, and connect with a community that ships.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
                <Button size="lg" className="px-8 gap-2" asChild>
                    <Link href="/submit">
                        <Upload className="size-4" />
                        Share your project
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 gap-2" asChild>
                    <Link href="/explore">
                        <Compass className="size-4" />
                        Explore projects
                    </Link>
                </Button>
            </div>
        </section>
    );
}

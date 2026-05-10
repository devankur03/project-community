import Link from "next/link";
import { Layers, Heart, Code2, Share2 } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Explore", href: "/explore" },
    { label: "Featured", href: "/featured" },
    { label: "Recently Launched", href: "/recent" },
    { label: "Submit a project", href: "/submit" },
  ],
  Community: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Changelog", href: "/changelog" },
    { label: "Newsletter", href: "/newsletter" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">

        {/* Top row */}
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">

          {/* Brand */}
          <div className="flex flex-col gap-4 sm:max-w-[220px]">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Layers className="size-4" />
              </span>
              <span className="font-heading text-lg tracking-tight">Launchpad</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A place to share what you've built and discover what the community is launching.
            </p>
            <div className="flex items-center gap-3">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Code2 className="size-4" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="size-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
                  {group}
                </p>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Launchpad. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="size-3 fill-primary text-primary" /> by the community
          </p>
        </div>

      </div>
    </footer>
  );
}

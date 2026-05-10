import { stats } from "@/lib/data";

export function StatsSection() {
  return (
    <section>
      <div className="grid grid-cols-3 divide-x divide-border">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1 py-8 px-6"
          >
            <span className="text-4xl font-bold text-primary">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

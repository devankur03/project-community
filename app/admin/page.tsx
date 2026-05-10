import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LayoutDashboard, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { getAdminStats, getPendingProducts, getAllProductsAdmin } from "@/lib/products/product-select";
import { PendingProductsTable } from "@/components/admin/PendingProductsTable";
import { AllProductsTable } from "@/components/admin/AllProductsTable";

function StatCard({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    accent: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <span className={`flex size-10 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="size-5" />
            </span>
            <div className="flex flex-col">
                <span className="text-2xl font-bold tabular-nums text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
            </div>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 animate-pulse">
            <div className="size-10 rounded-lg bg-muted" />
            <div className="flex flex-col gap-2">
                <div className="h-6 w-10 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
            </div>
        </div>
    );
}

async function AdminStats() {
    const stats = await getAdminStats();
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Products" value={stats.total} icon={Package} accent="bg-primary/10 text-primary" />
            <StatCard label="Pending" value={stats.pending} icon={Clock} accent="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" />
            <StatCard label="Approved" value={stats.approved} icon={CheckCircle} accent="bg-green-500/10 text-green-600 dark:text-green-400" />
            <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="bg-destructive/10 text-destructive" />
        </div>
    );
}

async function PendingSection() {
    const [stats, pendingProducts] = await Promise.all([getAdminStats(), getPendingProducts()]);
    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Pending Review
                </h2>
                {stats.pending > 0 && (
                    <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
                        {stats.pending} awaiting
                    </span>
                )}
            </div>
            <PendingProductsTable products={pendingProducts} />
        </>
    );
}

async function AllProductsSection() {
    const allProducts = await getAllProductsAdmin();
    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    All Products
                </h2>
                <span className="text-xs text-muted-foreground">{allProducts.length} total</span>
            </div>
            <AllProductsTable products={allProducts} />
        </>
    );
}

export default async function AdminPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user.publicMetadata?.isAdmin) redirect("/");

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-12 flex flex-col gap-10">

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-foreground">
                    <LayoutDashboard className="size-7 text-primary" />
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Review submitted products and monitor platform activity.
                </p>
            </div>

            {/* Stats overview */}
            <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Overview
                </h2>
                <Suspense fallback={
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
                    </div>
                }>
                    <AdminStats />
                </Suspense>
            </section>

            {/* Pending review */}
            <section className="flex flex-col gap-3">
                <Suspense fallback={
                    <div className="flex flex-col gap-3 animate-pulse">
                        <div className="h-4 w-36 rounded bg-muted" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-20 rounded-xl bg-muted" />
                        ))}
                    </div>
                }>
                    <PendingSection />
                </Suspense>
            </section>

            {/* All products */}
            <section className="flex flex-col gap-3">
                <Suspense fallback={
                    <div className="flex flex-col gap-3 animate-pulse">
                        <div className="h-4 w-28 rounded bg-muted" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-14 rounded-xl bg-muted" />
                        ))}
                    </div>
                }>
                    <AllProductsSection />
                </Suspense>
            </section>

        </div>
    );
}


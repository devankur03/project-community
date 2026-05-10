import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, gt, and, desc, gte, count } from 'drizzle-orm';

export const getFeaturedProducts = async () => {
    const productsData = await db.select().from(products)
        .where(
            and(
                eq(products.status, "approved"),
                gt(products.voteCount, 100)

            )
        ).orderBy(desc(products.voteCount));
    return productsData;
};

export const getRecentlyLaunchedProducts = async (oneWeekAgo: Date) => {
    const productsData = await db.select().from(products)
        .where(
            and(
                eq(products.status, "approved"),
                gte(products.approvedAt, oneWeekAgo)
            )
        ).orderBy(desc(products.approvedAt));
    return productsData;
};

export const getProductById = async (id: number) => {
    const [product] = await db.select().from(products)
        .where(eq(products.id, id))
        .limit(1);
    return product ?? null;
};

export const getAllProducts = async () => {
    return db.select().from(products)
        .where(eq(products.status, "approved"))
        .orderBy(desc(products.voteCount));
};

export const getAdminStats = async () => {
    const rows = await db
        .select({ status: products.status, count: count() })
        .from(products)
        .groupBy(products.status);

    const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    for (const row of rows) {
        stats.total += row.count;
        if (row.status === "pending") stats.pending = row.count;
        else if (row.status === "approved") stats.approved = row.count;
        else if (row.status === "rejected") stats.rejected = row.count;
    }
    return stats;
};

export const getPendingProducts = async () => {
    return db.select().from(products)
        .where(eq(products.status, "pending"))
        .orderBy(desc(products.createdAt));
};

export const getAllProductsAdmin = async () => {
    return db.select().from(products)
        .orderBy(desc(products.createdAt));
};
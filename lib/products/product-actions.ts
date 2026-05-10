'use server';

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters").max(60, "Name must be 60 characters or less"),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .max(60, "Slug must be 60 characters or less")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    tagLine: z.string().min(10, "Tagline must be at least 10 characters").max(120, "Tagline must be 120 characters or less"),
    description: z.string().min(30, "Description must be at least 30 characters").max(1000, "Description must be 1000 characters or less"),
    webUrl: z.string().url("Please enter a valid URL (e.g. https://example.com)"),
    tags: z
        .string()
        .min(1, "Add at least one tag")
        .transform((val) => val.split(",").map((t) => t.trim()).filter(Boolean))
        .refine((arr) => arr.length <= 5, "You can add a maximum of 5 tags"),
});

export type AddProductState =
    | { success: true }
    | { success: false; error: string; fieldErrors?: Partial<Record<keyof z.infer<typeof productSchema>, string[]>> }
    | null;

export async function addProduct(prevState: AddProductState, formData: FormData): Promise<AddProductState> {
    const { userId, orgId } = await auth();

    if (!userId) {
        return { success: false, error: "You must be signed in to submit a product." };
    }

    const raw = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        tagLine: formData.get("tagLine"),
        description: formData.get("description"),
        webUrl: formData.get("webUrl"),
        tags: formData.get("tags"),
    };

    const result = productSchema.safeParse(raw);

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors as Partial<Record<keyof z.infer<typeof productSchema>, string[]>>;
        return {
            success: false,
            error: "Please fix the errors below before submitting.",
            fieldErrors,
        };
    }

    try {
        await db.insert(products).values({
            name: result.data.name,
            slug: result.data.slug,
            tagLine: result.data.tagLine,
            description: result.data.description,
            webUrl: result.data.webUrl,
            tags: result.data.tags,
            submittedBy: userId,
            userId,
            organizationId: orgId ?? null,
        });

        return { success: true };
    } catch (e) {
        if (e instanceof Error && e.message.includes("unique")) {
            return {
                success: false,
                error: "A product with this slug already exists.",
                fieldErrors: { slug: ["This slug is already taken. Please choose a different one."] },
            };
        }
        console.error("Error inserting product:", e);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}

export type VoteType = "up" | "down";

export async function voteProduct(productId: number, type: VoteType): Promise<void> {
    const delta = type === "up" ? 1 : -1;

    await db
        .update(products)
        .set({ voteCount: sql`${products.voteCount} + ${delta}` })
        .where(eq(products.id, productId));

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/product/${productId}`);
}

import { clerkClient } from "@clerk/nextjs/server";

export type ReviewAction = "approved" | "rejected";

export async function reviewProduct(productId: number, action: ReviewAction): Promise<void> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user.publicMetadata?.isAdmin) throw new Error("Forbidden");

    await db
        .update(products)
        .set({
            status: action,
            approvedAt: action === "approved" ? new Date() : null,
        })
        .where(eq(products.id, productId));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/explore");
}

export async function deleteProduct(productId: number): Promise<void> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user.publicMetadata?.isAdmin) throw new Error("Forbidden");

    await db.delete(products).where(eq(products.id, productId));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/explore");
}
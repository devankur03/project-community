"use client";

import { useActionState, startTransition, useState, useEffect } from "react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal, AlertCircle } from "lucide-react";
import { addProduct } from "@/lib/products/product-actions";

const formSchema = z.object({
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
    .refine(
      (val) => val.split(",").map((t) => t.trim()).filter(Boolean).length <= 5,
      "You can add a maximum of 5 tags"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function SubmitProductForm() {
  const [state, dispatch, isPending] = useActionState(addProduct, null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) setShowSuccess(true);
  }, [state]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      tagLine: "",
      description: "",
      webUrl: "",
      tags: "",
    },
  });

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function onSubmit(values: FormValues) {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("slug", values.slug);
    fd.append("tagLine", values.tagLine);
    fd.append("description", values.description);
    fd.append("webUrl", values.webUrl);
    fd.append("tags", values.tags);
    startTransition(() => dispatch(fd));
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/40 px-8 py-16 text-center">
        <span className="text-4xl">🎉</span>
        <h2 className="text-xl font-semibold text-foreground">Submission received!</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your project has been submitted for review. We&apos;ll notify you once it&apos;s approved.
        </p>
        <Button variant="outline" className="mt-2" onClick={() => { form.reset(); setShowSuccess(false); }}>
          Submit another project
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* Server error banner */}
        {state?.success === false && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<FormValues, "name"> }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Acme Analytics"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!form.getValues("slug")) {
                      form.setValue("slug", generateSlug(e.target.value), { shouldValidate: false });
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The public display name of your product. Keep it short and recognisable.
              </FormDescription>
              <FormMessage />
              {state?.success === false && state.fieldErrors?.name?.map((msg) => (
                <p key={msg} className="text-sm font-medium text-destructive">{msg}</p>
              ))}
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }: { field: ControllerRenderProps<FormValues, "slug"> }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring overflow-hidden">
                  <span className="px-3 text-sm text-muted-foreground select-none border-r border-input bg-muted">
                    /product/
                  </span>
                  <input
                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="acme-analytics"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                URL-friendly identifier. Auto-filled from the name — lowercase letters, numbers and hyphens only.
              </FormDescription>
              <FormMessage />
              {state?.success === false && state.fieldErrors?.slug?.map((msg) => (
                <p key={msg} className="text-sm font-medium text-destructive">{msg}</p>
              ))}
            </FormItem>
          )}
        />

        {/* Tagline */}
        <FormField
          control={form.control}
          name="tagLine"
          render={({ field }: { field: ControllerRenderProps<FormValues, "tagLine"> }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input placeholder="e.g. The analytics platform that respects your users" {...field} />
              </FormControl>
              <FormDescription>
                A one-liner that tells visitors what your product does. Shown on cards and listings.
              </FormDescription>
              <FormMessage />
              {state?.success === false && state.fieldErrors?.tagLine?.map((msg) => (
                <p key={msg} className="text-sm font-medium text-destructive">{msg}</p>
              ))}
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: ControllerRenderProps<FormValues, "description"> }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product — what problem it solves, who it's for, and what makes it unique."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Full description shown on the product detail page. Minimum 30 characters, up to 1000.
              </FormDescription>
              <FormMessage />
              {state?.success === false && state.fieldErrors?.description?.map((msg) => (
                <p key={msg} className="text-sm font-medium text-destructive">{msg}</p>
              ))}
            </FormItem>
          )}
        />

        {/* Website URL */}
        <FormField
          control={form.control}
          name="webUrl"
          render={({ field }: { field: ControllerRenderProps<FormValues, "webUrl"> }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://yourproduct.com" {...field} />
              </FormControl>
              <FormDescription>
                The main URL where people can learn about or sign up for your product.
              </FormDescription>
              <FormMessage />
              {state?.success === false && state.fieldErrors?.webUrl?.map((msg) => (
                <p key={msg} className="text-sm font-medium text-destructive">{msg}</p>
              ))}
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }: { field: ControllerRenderProps<FormValues, "tags"> }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g. analytics, saas, open-source" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated tags that describe your product category. Up to 5 tags (e.g. <code className="text-xs font-mono">ai, productivity, developer-tools</code>).
              </FormDescription>
              <FormMessage />
              {state?.success === false && state.fieldErrors?.tags?.map((msg) => (
                <p key={msg} className="text-sm font-medium text-destructive">{msg}</p>
              ))}
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="self-start">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Submit Project
              <SendHorizonal className="size-4" />
            </>
          )}
        </Button>

      </form>
    </Form>
  );
}


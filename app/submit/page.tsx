import { SubmitProductForm } from "@/components/submit/SubmitProductForm";
import { Rocket } from "lucide-react";

export default function SubmitPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
          <Rocket className="size-7 text-primary" />
          Submit your project
        </h1>
        <p className="text-muted-foreground">
          Share your product with the community. All submissions are reviewed before going live.
        </p>
      </div>
      <SubmitProductForm />
    </div>
  );
}

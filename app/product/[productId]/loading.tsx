export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 animate-pulse">
      <div className="mb-8 h-4 w-24 rounded bg-muted" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-5 w-full rounded bg-muted" />
        </div>
        <div className="h-16 w-12 rounded bg-muted" />
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted" />
        <div className="h-6 w-20 rounded-full bg-muted" />
        <div className="h-6 w-14 rounded-full bg-muted" />
      </div>

      <div className="mt-6 h-9 w-36 rounded bg-muted" />

      <hr className="my-8 border-border" />

      <div className="flex flex-col gap-3">
        <div className="h-6 w-24 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-10 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <h1 className="text-2xl font-semibold">Token not found</h1>
        <p className="text-sm text-zinc-500">
          The token you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/app"
          className="text-sm text-rose-500 hover:underline"
        >
          ← Back to dashboard
        </Link>
      </main>
    </div>
  );
}


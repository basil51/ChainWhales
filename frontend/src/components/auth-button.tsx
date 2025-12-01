"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function AuthButton() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <>
        <Link
          href="/sign-in"
          className="rounded-lg bg-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-rose-600"
        >
          Sign In to Access Dashboard
        </Link>
        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Sign In
          </Link>
          <span className="text-zinc-300">•</span>
          <Link
            href="/sign-up"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Sign Up
          </Link>
        </div>
      </>
    );
  }

  return (
    <Link
      href="/app"
      className="rounded-lg bg-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-rose-600"
    >
      Go to Dashboard
    </Link>
  );
}


import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/app" className="text-xl font-semibold text-rose-500">
            ChainWhales.io
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </Link>
            <Link
              href="/app/subscription"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Subscription
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}


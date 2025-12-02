import { DashboardContent } from "@/components/dashboard-content";
import { getAlerts, getTokens } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";

export default async function AppDashboard() {
  const user = await currentUser();
  const [tokens, alerts] = await Promise.all([getTokens(), getAlerts()]);

  return (
    <div className="px-4 py-10 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-rose-500">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold">
            Real-time accumulation overview
          </h1>
          <p className="max-w-3xl text-sm text-zinc-500">
            Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
            Real-time accumulation signals from on-chain data.
          </p>
        </header>

        <DashboardContent initialAlerts={alerts} initialTokens={tokens} />
      </main>
    </div>
  );
}


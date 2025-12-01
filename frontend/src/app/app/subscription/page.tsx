import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function SubscriptionPage() {
  const user = await currentUser();

  return (
    <div className="px-4 py-10 text-zinc-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Subscription Management</h1>
          <p className="text-sm text-zinc-500">
            Manage your plan and billing preferences.
          </p>
        </header>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-lg font-semibold">Current Plan</h2>
              <p className="text-sm text-zinc-600">
                Your account: {user?.emailAddresses[0]?.emailAddress}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Plan status will be displayed here once integrated with backend
                user data.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 p-6">
                <h3 className="mb-2 font-semibold">Basic</h3>
                <p className="mb-4 text-2xl font-bold">$39</p>
                <ul className="mb-4 space-y-2 text-sm text-zinc-600">
                  <li>• Real-time alerts</li>
                  <li>• 1 chain</li>
                  <li>• Unlimited alerts</li>
                </ul>
                <Link
                  href="/api/billing/checkout?plan=basic"
                  className="block rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Upgrade
                </Link>
              </div>

              <div className="rounded-xl border-2 border-rose-500 bg-rose-50 p-6">
                <h3 className="mb-2 font-semibold">Pro</h3>
                <p className="mb-4 text-2xl font-bold">$149</p>
                <ul className="mb-4 space-y-2 text-sm text-zinc-600">
                  <li>• All chains</li>
                  <li>• Unlimited alerts</li>
                  <li>• Telegram bot</li>
                  <li>• API access</li>
                </ul>
                <Link
                  href="/api/billing/checkout?plan=pro"
                  className="block rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Upgrade
                </Link>
              </div>

              <div className="rounded-xl border border-zinc-200 p-6">
                <h3 className="mb-2 font-semibold">Whale</h3>
                <p className="mb-4 text-2xl font-bold">$799</p>
                <ul className="mb-4 space-y-2 text-sm text-zinc-600">
                  <li>• Priority scanning</li>
                  <li>• Custom filters</li>
                  <li>• Fund-level tools</li>
                  <li>• Dedicated support</li>
                </ul>
                <Link
                  href="/api/billing/checkout?plan=whale"
                  className="block rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

export default async function SubscriptionPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  let plan = "free";
  if (email) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/status?email=${encodeURIComponent(email)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        plan = data.plan;
      }
    } catch (e) {
      console.error("Failed to fetch plan", e);
    }
  }

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
                Your account: <span className="font-medium">{email}</span>
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Current Plan: <span className="uppercase">{plan}</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className={`rounded-xl border p-6 ${plan === 'free' ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' : 'border-zinc-200'}`}>
                <h3 className="mb-2 font-semibold">Free</h3>
                <p className="mb-4 text-2xl font-bold">$0</p>
                <ul className="mb-4 space-y-2 text-sm text-zinc-600">
                  <li>• 5 alerts / day</li>
                  <li>• 15-minute delay</li>
                  <li>• 1 chain preview</li>
                </ul>
                {plan === 'free' ? (
                  <div className="text-center text-sm font-semibold text-rose-600">Current Plan</div>
                ) : (
                  <p className="text-xs text-zinc-500">Downgrade available via support.</p>
                )}
              </div>

              <div className={`rounded-xl border p-6 ${plan === 'basic' ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' : 'border-zinc-200'}`}>
                <h3 className="mb-2 font-semibold">Basic</h3>
                <p className="mb-4 text-2xl font-bold">$29</p>
                <ul className="mb-4 space-y-2 text-sm text-zinc-600">
                  <li>• Real-time alerts</li>
                  <li>• 1 chain</li>
                  <li>• Unlimited alerts</li>
                </ul>
                {plan === 'basic' ? (
                  <div className="text-center text-sm font-semibold text-rose-600">Current Plan</div>
                ) : (
                  <Link
                    href="/api/billing/checkout?plan=basic"
                    className="block rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Upgrade
                  </Link>
                )}
              </div>

              <div className={`rounded-xl border p-6 ${plan === 'pro' ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' : 'border-zinc-200'}`}>
                <h3 className="mb-2 font-semibold">Pro</h3>
                <p className="mb-4 text-2xl font-bold">$59</p>
                <ul className="mb-4 space-y-2 text-sm text-zinc-600">
                  <li>• All chains</li>
                  <li>• Unlimited alerts</li>
                  <li>• Telegram bot</li>
                  <li>• API access</li>
                </ul>
                {plan === 'pro' ? (
                  <div className="text-center text-sm font-semibold text-rose-600">Current Plan</div>
                ) : (
                  <Link
                    href="/api/billing/checkout?plan=pro"
                    className="block rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Upgrade
                  </Link>
                )}
              </div>

              <div className={`rounded-xl border p-6 ${plan === 'whale' ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' : 'border-zinc-200'}`}>
                <h3 className="mb-2 font-semibold">Whale</h3>
                <p className="mb-4 text-2xl font-bold">$99</p>
                <ul className="mb-4 space-y-2 text-sm text-zinc-600">
                  <li>• Priority scanning</li>
                  <li>• Custom filters</li>
                  <li>• Fund-level tools</li>
                  <li>• Dedicated support</li>
                </ul>
                {plan === 'whale' ? (
                  <div className="text-center text-sm font-semibold text-rose-600">Current Plan</div>
                ) : (
                  <Link
                    href="/api/billing/checkout?plan=whale"
                    className="block rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

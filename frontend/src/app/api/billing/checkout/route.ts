import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const plan = searchParams.get("plan");

  if (!plan || !["basic", "pro", "whale"].includes(plan)) {
    return NextResponse.json(
      { error: "Invalid plan. Must be basic, pro, or whale" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/billing/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: user.emailAddresses[0]?.emailAddress || "",
        plan: plan,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || "Failed to create checkout session" },
        { status: response.status }
      );
    }

    const session = await response.json();
    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}


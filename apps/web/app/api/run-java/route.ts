import { NextResponse } from "next/server";

const runnerUrl = process.env.RUNNER_API_URL ?? "http://localhost:4001";

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const response = await fetch(`${runnerUrl}/run-java`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        runtimeError: "Runner service unreachable. Start apps/runner at port 4001."
      },
      { status: 503 }
    );
  }
}

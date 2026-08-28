import { NextResponse } from "next/server";

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function withApiHandler(
  fn: (request: Request) => Promise<NextResponse>,
  context: string,
) {
  return async function handler(request: Request) {
    try {
      return await fn(request);
    } catch (error) {
      if (error instanceof HttpError) {
        return apiError(error.message, error.status);
      }
      console.error(`${context} error:`, error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

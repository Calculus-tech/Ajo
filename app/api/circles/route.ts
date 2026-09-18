import { NextRequest, NextResponse } from "next/server";
import { createCircle } from "@/lib/circles";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const circle = createCircle(body);
  return NextResponse.json(circle);
}
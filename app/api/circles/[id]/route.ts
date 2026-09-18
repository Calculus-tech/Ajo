import { NextRequest, NextResponse } from "next/server";
import { getCircle } from "@/lib/circles";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const circle = getCircle(id);
  if (!circle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(circle);
}
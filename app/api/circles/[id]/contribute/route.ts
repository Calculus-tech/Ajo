import { NextRequest, NextResponse } from "next/server";
import { markPaid } from "@/lib/circles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { address } = await req.json();
  const circle = markPaid(id, address);
  if (!circle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(circle);
}
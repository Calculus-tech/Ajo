import { NextRequest, NextResponse } from "next/server";
import { releasePayout } from "@/lib/circles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { recipientAddress } = await req.json();
  const circle = releasePayout(id, recipientAddress);
  if (!circle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(circle);
}
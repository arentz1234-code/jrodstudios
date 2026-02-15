import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return NextResponse.json({
    id,
    status: "confirmed",
    message: "Booking found"
  });
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  return NextResponse.json({ id, ...body });
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return NextResponse.json({ message: `Booking ${id} cancelled` });
}

import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBooking, deleteBooking } from "@/lib/bookings-store";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const booking = getBookingById(id);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await request.json();

  const updated = updateBooking(id, body);

  if (!updated) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;

  // Instead of deleting, mark as cancelled
  const updated = updateBooking(id, { status: "cancelled" });

  if (!updated) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Booking cancelled", booking: updated });
}

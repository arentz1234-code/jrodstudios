import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes, format, startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (date) {
      const dateObj = new Date(date);
      where.date = {
        gte: startOfDay(dateObj),
        lte: endOfDay(dateObj),
      };
    }

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      date,
      startTime,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = body;

    // Validate required fields
    if (
      !serviceId ||
      !date ||
      !startTime ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get service to calculate end time
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Calculate end time
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = addMinutes(startDate, service.duration);
    const endTime = format(endDate, "HH:mm");

    // Check for conflicting bookings
    const bookingDate = new Date(date);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: {
          gte: startOfDay(bookingDate),
          lte: endOfDay(bookingDate),
        },
        status: { not: "cancelled" },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot is no longer available" },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date: startOfDay(bookingDate),
        startTime,
        endTime,
        customerName,
        customerEmail,
        customerPhone,
        notes: notes || null,
      },
      include: { service: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "@/lib/utils";
import { startOfDay, endOfDay, getDay } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");

    if (!dateStr || !serviceId) {
      return NextResponse.json(
        { error: "Date and serviceId are required" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    const dayOfWeek = getDay(date);

    // Get business hours for this day
    const businessHours = await prisma.businessHours.findUnique({
      where: { dayOfWeek },
    });

    if (!businessHours || !businessHours.isOpen) {
      return NextResponse.json({ slots: [], message: "Closed on this day" });
    }

    // Get the service duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Get existing bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { not: "cancelled" },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Get blocked times for this date
    const blockedTimes = await prisma.blockedTime.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      select: {
        startTime: true,
        endTime: true,
        allDay: true,
      },
    });

    // Generate available time slots
    const slots = generateTimeSlots(
      businessHours.openTime!,
      businessHours.closeTime!,
      service.duration,
      bookings,
      blockedTimes
    );

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

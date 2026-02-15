import { NextRequest, NextResponse } from "next/server";
import { addMinutes, format } from "date-fns";

// Service data for calculating end times
const services: Record<string, { name: string; price: number; duration: number }> = {
  "regular-cut": { name: "Regular Cut", price: 30, duration: 30 },
  "skin-fade": { name: "Skin Fade", price: 30, duration: 45 },
  "beard-service": { name: "Beard Service", price: 20, duration: 30 },
  "haircut-beard": { name: "Haircut & Beard", price: 45, duration: 50 },
  "hot-towel-shave": { name: "Hot Towel Shave", price: 65, duration: 55 },
  "line-up": { name: "Line Up", price: 10, duration: 15 },
  "facial-hair": { name: "Facial Hair", price: 5, duration: 15 },
  "eyebrows": { name: "Eyebrows", price: 5, duration: 5 },
};

export async function GET(request: NextRequest) {
  // For demo - return empty array (no bookings stored)
  const searchParams = request.nextUrl.searchParams;
  console.log("Fetching bookings with params:", searchParams.toString());
  return NextResponse.json([]);
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
    if (!serviceId || !date || !startTime || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = services[serviceId];
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Calculate end time
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = addMinutes(startDate, service.duration);
    const endTime = format(endDate, "HH:mm");

    // Create mock booking response (in production this would save to database)
    const booking = {
      id: `booking-${Date.now()}`,
      serviceId,
      date: new Date(date).toISOString(),
      startTime,
      endTime,
      customerName,
      customerEmail,
      customerPhone,
      notes: notes || null,
      status: "confirmed",
      service: {
        id: serviceId,
        name: service.name,
        price: service.price,
        duration: service.duration,
      },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

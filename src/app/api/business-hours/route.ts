import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hours = await prisma.businessHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
    return NextResponse.json(hours);
  } catch (error) {
    console.error("Error fetching business hours:", error);
    return NextResponse.json(
      { error: "Failed to fetch business hours" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { hours } = body;

    if (!Array.isArray(hours)) {
      return NextResponse.json(
        { error: "Hours must be an array" },
        { status: 400 }
      );
    }

    // Update each day's hours
    for (const hour of hours) {
      await prisma.businessHours.upsert({
        where: { dayOfWeek: hour.dayOfWeek },
        update: {
          isOpen: hour.isOpen,
          openTime: hour.isOpen ? hour.openTime : null,
          closeTime: hour.isOpen ? hour.closeTime : null,
        },
        create: {
          dayOfWeek: hour.dayOfWeek,
          isOpen: hour.isOpen,
          openTime: hour.isOpen ? hour.openTime : null,
          closeTime: hour.isOpen ? hour.closeTime : null,
        },
      });
    }

    const updatedHours = await prisma.businessHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(updatedHours);
  } catch (error) {
    console.error("Error updating business hours:", error);
    return NextResponse.json(
      { error: "Failed to update business hours" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    const where: Record<string, unknown> = {};

    if (date) {
      const dateObj = new Date(date);
      where.date = {
        gte: startOfDay(dateObj),
        lte: endOfDay(dateObj),
      };
    }

    const blockedTimes = await prisma.blockedTime.findMany({
      where,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(blockedTimes);
  } catch (error) {
    console.error("Error fetching blocked times:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked times" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, startTime, endTime, allDay, reason } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const blockedTime = await prisma.blockedTime.create({
      data: {
        date: startOfDay(new Date(date)),
        startTime: allDay ? null : startTime,
        endTime: allDay ? null : endTime,
        allDay: allDay || false,
        reason: reason || null,
      },
    });

    return NextResponse.json(blockedTime, { status: 201 });
  } catch (error) {
    console.error("Error creating blocked time:", error);
    return NextResponse.json(
      { error: "Failed to create blocked time" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.blockedTime.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Blocked time deleted" });
  } catch (error) {
    console.error("Error deleting blocked time:", error);
    return NextResponse.json(
      { error: "Failed to delete blocked time" },
      { status: 500 }
    );
  }
}

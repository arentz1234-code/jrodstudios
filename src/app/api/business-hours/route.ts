import { NextResponse } from "next/server";

const businessHours = [
  { id: "0", dayOfWeek: 0, isOpen: false, openTime: null, closeTime: null },
  { id: "1", dayOfWeek: 1, isOpen: false, openTime: null, closeTime: null },
  { id: "2", dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { id: "3", dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { id: "4", dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { id: "5", dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { id: "6", dayOfWeek: 6, isOpen: true, openTime: "08:00", closeTime: "14:00" },
];

export async function GET() {
  return NextResponse.json(businessHours);
}

export async function PUT() {
  return NextResponse.json({ message: "Business hours updated" });
}

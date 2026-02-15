import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  parse,
  addMinutes,
  isBefore,
  isAfter,
  startOfDay,
  isSameDay,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  duration: number,
  bookedSlots: { startTime: string; endTime: string }[],
  blockedSlots: { startTime: string | null; endTime: string | null; allDay: boolean }[]
): string[] {
  const slots: string[] = [];
  const baseDate = new Date();

  let current = parse(openTime, "HH:mm", baseDate);
  const end = parse(closeTime, "HH:mm", baseDate);

  // If any slot is all day blocked, return empty
  if (blockedSlots.some((b) => b.allDay)) {
    return [];
  }

  while (isBefore(addMinutes(current, duration), end) ||
         format(addMinutes(current, duration), "HH:mm") === closeTime) {
    const slotStart = format(current, "HH:mm");
    const slotEnd = format(addMinutes(current, duration), "HH:mm");

    // Check if slot overlaps with any booked slot
    const isBooked = bookedSlots.some((booked) => {
      return !(slotEnd <= booked.startTime || slotStart >= booked.endTime);
    });

    // Check if slot overlaps with any blocked time
    const isBlocked = blockedSlots.some((blocked) => {
      if (blocked.allDay) return true;
      if (!blocked.startTime || !blocked.endTime) return false;
      return !(slotEnd <= blocked.startTime || slotStart >= blocked.endTime);
    });

    if (!isBooked && !isBlocked) {
      slots.push(slotStart);
    }

    current = addMinutes(current, 15); // 15-minute increments
  }

  return slots;
}

export function isDateInPast(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(new Date()));
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function formatDate(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
}

export function formatDateShort(date: Date): string {
  return format(date, "MMM d, yyyy");
}

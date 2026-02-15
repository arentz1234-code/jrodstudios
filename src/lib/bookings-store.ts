// In-memory booking store (for demo purposes)
// In production, this would be a database

export interface Booking {
  id: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  status: "confirmed" | "completed" | "cancelled";
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  createdAt: string;
}

// Global store that persists during server runtime
const bookings: Map<string, Booking> = new Map();

export function getAllBookings(): Booking[] {
  return Array.from(bookings.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.get(id);
}

export function getBookingsByDate(date: string): Booking[] {
  const targetDate = new Date(date).toDateString();
  return getAllBookings().filter(
    (booking) => new Date(booking.date).toDateString() === targetDate && booking.status !== "cancelled"
  );
}

export function getBookingsByStatus(status: string): Booking[] {
  return getAllBookings().filter((booking) => booking.status === status);
}

export function addBooking(booking: Booking): Booking {
  bookings.set(booking.id, booking);
  return booking;
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | null {
  const existing = bookings.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };
  bookings.set(id, updated);
  return updated;
}

export function deleteBooking(id: string): boolean {
  return bookings.delete(id);
}

export function isTimeSlotBooked(date: string, startTime: string): boolean {
  const dateBookings = getBookingsByDate(date);
  return dateBookings.some((booking) => booking.startTime === startTime);
}

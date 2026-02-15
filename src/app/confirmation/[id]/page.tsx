import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, formatPrice, formatDuration } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  IoCheckmarkCircle,
  IoCalendarOutline,
  IoLocationOutline,
  IoCallOutline,
} from "react-icons/io5";

interface Props {
  params: Promise<{ id: string }>;
}

async function getBooking(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true },
  });
  return booking;
}

export default async function ConfirmationPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  const startDateTime = new Date(booking.date);
  const [hours, minutes] = booking.startTime.split(":").map(Number);
  startDateTime.setHours(hours, minutes, 0, 0);

  const endDateTime = new Date(startDateTime);
  endDateTime.setMinutes(endDateTime.getMinutes() + booking.service.duration);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${booking.service.name} at J.ROD Studios`
  )}&dates=${startDateTime
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "")}/${endDateTime
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "")}&location=${encodeURIComponent(
    BUSINESS_INFO.address
  )}&details=${encodeURIComponent(
    `Your appointment at J.ROD Studios\nService: ${booking.service.name}\nPhone: ${BUSINESS_INFO.phone}`
  )}`;

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal-dark/95 backdrop-blur-md border-b border-cream/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <Link href="/" className="font-serif text-xl font-bold text-cream">
              J.ROD<span className="text-sage">.</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          {/* Success Icon */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 border-2 border-sage rounded-full flex items-center justify-center mx-auto mb-6">
              <IoCheckmarkCircle className="w-12 h-12 text-sage" />
            </div>
            <p className="section-subheading mb-4">Confirmed</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-4">
              You&apos;re All Set
            </h1>
            <p className="text-cream/50">
              A confirmation has been sent to {booking.customerEmail}
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-charcoal-light border border-cream/10 p-8 mb-6">
            <h2 className="font-serif text-xl text-cream mb-6">Appointment Details</h2>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-cream/10">
                <span className="text-cream/50">Service</span>
                <span className="text-cream font-medium">{booking.service.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cream/10">
                <span className="text-cream/50">Date</span>
                <span className="text-cream font-medium">{formatDate(booking.date)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cream/10">
                <span className="text-cream/50">Time</span>
                <span className="text-cream font-medium">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-cream/10">
                <span className="text-cream/50">Duration</span>
                <span className="text-cream font-medium">
                  {formatDuration(booking.service.duration)}
                </span>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-cream font-semibold">Total</span>
                <span className="font-serif text-2xl text-sage">
                  {formatPrice(booking.service.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Calendar */}
          <div className="bg-charcoal-light border border-cream/10 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <IoCalendarOutline className="w-5 h-5 text-sage" />
              <h3 className="font-serif text-lg text-cream">Add to Calendar</h3>
            </div>
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline block text-center"
            >
              Add to Google Calendar
            </a>
          </div>

          {/* Location */}
          <div className="bg-charcoal-light border border-cream/10 p-6 mb-10">
            <h3 className="font-serif text-lg text-cream mb-4">Location</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <IoLocationOutline className="w-5 h-5 text-sage mt-0.5" />
                <span className="text-cream/70">{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <IoCallOutline className="w-5 h-5 text-sage" />
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="text-sage hover:text-sage-light transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-outline text-center">
              Book Another
            </Link>
            <Link href="/" className="btn-primary text-center">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

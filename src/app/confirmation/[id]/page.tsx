"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  IoCheckmarkCircle,
  IoCalendarOutline,
  IoLocationOutline,
  IoCallOutline,
} from "react-icons/io5";

export default function ConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;

  // For demo purposes - show generic confirmation
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Appointment at J.ROD Studios"
  )}&location=${encodeURIComponent(BUSINESS_INFO.address)}&details=${encodeURIComponent(
    `Your appointment at J.ROD Studios\nPhone: ${BUSINESS_INFO.phone}`
  )}`;

  return (
    <div className="min-h-screen bg-forest-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-dark/95 backdrop-blur-md border-b border-cream/10">
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
            <p className="text-sage text-sm uppercase tracking-[0.2em] mb-4">Confirmed</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-4">
              You&apos;re All Set
            </h1>
            <p className="text-cream/50">
              Your booking has been confirmed
            </p>
            <p className="text-cream/30 text-sm mt-2">
              Booking ID: {bookingId}
            </p>
          </div>

          {/* Booking Info */}
          <div className="bg-cream-dark border border-forest/10 p-8 mb-6">
            <h2 className="font-serif text-xl text-forest mb-6">What&apos;s Next</h2>
            <div className="space-y-4 text-forest/70">
              <p>Your appointment has been scheduled. Please arrive 5-10 minutes early.</p>
              <p>If you need to reschedule or cancel, please call us at {BUSINESS_INFO.phone}.</p>
            </div>
          </div>

          {/* Add to Calendar */}
          <div className="bg-cream-dark border border-forest/10 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <IoCalendarOutline className="w-5 h-5 text-forest" />
              <h3 className="font-serif text-lg text-forest">Add to Calendar</h3>
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
          <div className="bg-cream-dark border border-forest/10 p-6 mb-10">
            <h3 className="font-serif text-lg text-forest mb-4">Location</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <IoLocationOutline className="w-5 h-5 text-forest mt-0.5" />
                <span className="text-forest/70">{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <IoCallOutline className="w-5 h-5 text-forest" />
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="text-forest hover:text-forest-light transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#book" className="btn-outline text-center">
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

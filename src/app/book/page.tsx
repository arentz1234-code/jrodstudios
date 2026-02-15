"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDate, formatTime, formatPrice, formatDuration } from "@/lib/utils";
import { IoArrowBack, IoCheckmarkCircle, IoChevronBack } from "react-icons/io5";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

const steps = [
  { id: 1, title: "Service" },
  { id: 2, title: "Date" },
  { id: 3, title: "Time" },
  { id: 4, title: "Details" },
];

// Navigation component
function BookingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-dark/95 backdrop-blur-md border-b border-cream/10">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 text-cream/70 hover:text-cream transition-colors">
            <IoChevronBack className="w-5 h-5" />
            <span className="font-sans text-sm uppercase tracking-wider">Back</span>
          </Link>
          <span className="font-serif text-xl font-bold text-cream">
            J.ROD<span className="text-forest">.</span>
          </span>
          <div className="w-20" />
        </div>
      </div>
    </nav>
  );
}

// Stepper component
function BookingStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-sm font-semibold transition-all border ${
                    isCompleted
                      ? "bg-forest border-forest text-cream"
                      : isCurrent
                      ? "bg-transparent border-forest text-forest"
                      : "bg-transparent border-cream/20 text-cream/40"
                  }`}
                >
                  {isCompleted ? <IoCheckmarkCircle className="w-5 h-5" /> : step.id}
                </div>
                <span
                  className={`mt-2 text-xs font-sans uppercase tracking-wider hidden sm:block ${
                    isCurrent ? "text-cream" : "text-cream/40"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 ${
                    isCompleted ? "bg-forest" : "bg-cream/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Calendar component
function Calendar({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDisabled = (date: Date) => {
    return date < today || date.getDay() === 0;
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return d1.toDateString() === d2.toDateString();
  };

  return (
    <div className="bg-cream-light border border-forest/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-forest/10 rounded transition-colors text-forest/70 hover:text-forest"
        >
          <IoChevronBack className="w-5 h-5" />
        </button>
        <h3 className="font-serif text-xl text-forest">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-forest/10 rounded transition-colors text-forest/70 hover:text-forest rotate-180"
        >
          <IoChevronBack className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs uppercase tracking-wider text-forest/50 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <button
                onClick={() => !isDisabled(date) && onDateSelect(date)}
                disabled={isDisabled(date)}
                className={`w-full h-full flex items-center justify-center text-sm font-sans transition-all ${
                  isSameDay(date, selectedDate)
                    ? "bg-forest text-cream"
                    : isDisabled(date)
                    ? "text-forest/20 cursor-not-allowed"
                    : isSameDay(date, today)
                    ? "border border-forest/50 text-forest hover:bg-forest/20"
                    : "text-forest/70 hover:bg-forest/10"
                }`}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Time slots component
function TimeSlots({
  slots,
  selectedTime,
  onTimeSelect,
  isLoading,
}: {
  slots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-cream-light border border-forest/10 p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-cream-light border border-forest/10 p-8">
        <p className="text-center text-forest/50 py-8">
          No available times for this date.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream-light border border-forest/10 p-6">
      <h3 className="font-serif text-lg text-forest mb-4">Available Times</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onTimeSelect(slot)}
            className={`py-3 px-4 text-sm font-sans transition-all border ${
              selectedTime === slot
                ? "bg-forest border-forest text-cream"
                : "border-forest/20 text-forest/70 hover:border-forest/50 hover:text-forest"
            }`}
          >
            {formatTime(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Booking form component
function BookingForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: { customerName: string; customerEmail: string; customerPhone: string; notes: string }) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-forest/70 uppercase tracking-wider mb-2">Full Name</label>
        <input
          type="text"
          required
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="w-full px-4 py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-sm text-forest/70 uppercase tracking-wider mb-2">Email</label>
        <input
          type="email"
          required
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          className="w-full px-4 py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label className="block text-sm text-forest/70 uppercase tracking-wider mb-2">Phone</label>
        <input
          type="tel"
          required
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          className="w-full px-4 py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors"
          placeholder="(555) 123-4567"
        />
      </div>
      <div>
        <label className="block text-sm text-forest/70 uppercase tracking-wider mb-2">Notes (optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors resize-none"
          placeholder="Any special requests..."
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50"
      >
        {isLoading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}

// Main booking content
function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service");

  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);

      if (preselectedServiceId) {
        const service = data.find((s: Service) => s.id === preselectedServiceId);
        if (service) {
          setSelectedService(service);
          setCurrentStep(2);
        }
      }
    }
    fetchServices();
  }, [preselectedServiceId]);

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate || !selectedService) return;

      setIsLoadingSlots(true);
      setSelectedTime(null);

      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const res = await fetch(`/api/availability?date=${dateStr}&serviceId=${selectedService.id}`);
        const data = await res.json();
        setAvailableSlots(data.slots || []);
      } catch {
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate, selectedService]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(4);
  };

  const handleFormSubmit = async (formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
  }) => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate.toISOString(),
          startTime: selectedTime,
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const booking = await res.json();
      router.push(`/confirmation/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="section-subheading mb-4">Schedule Your Visit</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">
            Book Appointment
          </h1>
        </div>

        {/* Stepper */}
        <BookingStepper currentStep={currentStep} />

        {/* Back Button */}
        {currentStep > 1 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-cream/50 hover:text-cream mb-6 transition-colors"
          >
            <IoArrowBack className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Back</span>
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: Select Service */}
        {currentStep === 1 && (
          <div>
            <h2 className="font-serif text-2xl text-cream mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-6 text-left transition-all border ${
                    selectedService?.id === service.id
                      ? "bg-cream-light border-forest"
                      : "bg-cream-light border-forest/10 hover:border-forest/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-forest">{service.name}</h3>
                    <span className="font-serif text-2xl text-forest">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                  <p className="text-forest/60 text-sm mb-2">{service.description}</p>
                  <p className="text-xs text-forest/50 uppercase tracking-wider">
                    {formatDuration(service.duration)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date */}
        {currentStep === 2 && (
          <div>
            <h2 className="font-serif text-2xl text-cream mb-6">Select a Date</h2>
            <div className="max-w-md mx-auto">
              <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
              <p className="text-center text-cream/40 text-sm mt-4">Closed on Sundays</p>
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {currentStep === 3 && (
          <div>
            <h2 className="font-serif text-2xl text-cream mb-2">Select a Time</h2>
            {selectedDate && (
              <p className="text-cream/50 mb-6">{formatDate(selectedDate)}</p>
            )}
            <TimeSlots
              slots={availableSlots}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              isLoading={isLoadingSlots}
            />
          </div>
        )}

        {/* Step 4: Contact Details */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Summary */}
            <div className="bg-cream-light border border-forest/10 p-6">
              <h3 className="font-serif text-xl text-forest mb-6">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-forest/10">
                  <span className="text-forest/50">Service</span>
                  <span className="text-forest">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-forest/10">
                  <span className="text-forest/50">Date</span>
                  <span className="text-forest">{selectedDate && formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-forest/10">
                  <span className="text-forest/50">Time</span>
                  <span className="text-forest">{selectedTime && formatTime(selectedTime)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-forest/10">
                  <span className="text-forest/50">Duration</span>
                  <span className="text-forest">
                    {selectedService && formatDuration(selectedService.duration)}
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-forest font-semibold">Total</span>
                  <span className="font-serif text-2xl text-forest">
                    {selectedService && formatPrice(selectedService.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-cream-light border border-forest/10 p-6">
              <h3 className="font-serif text-xl text-forest mb-6">Your Details</h3>
              <BookingForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function BookPageLoading() {
  return (
    <main className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
        </div>
      </div>
    </main>
  );
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-forest-dark">
      <BookingNav />
      <Suspense fallback={<BookPageLoading />}>
        <BookPageContent />
      </Suspense>
    </div>
  );
}

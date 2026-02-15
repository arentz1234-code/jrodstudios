"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoLocationOutline,
  IoCallOutline,
  IoTimeOutline,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoTwitter,
  IoMenuOutline,
  IoCloseOutline,
  IoChevronDown,
  IoCheckmarkCircle,
  IoChevronBack,
} from "react-icons/io5";
import { formatDate, formatTime, formatPrice, formatDuration } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

// Animation hook for scroll-triggered animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated Section wrapper
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Navigation
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#book", label: "Book" },
    { href: "#about", label: "About" },
    { href: "#location", label: "Location" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? "bg-forest-dark/95 backdrop-blur-md border-b border-cream/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <a href="#" className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-5 h-8 sm:w-6 sm:h-10 rounded-full overflow-hidden border-2 border-cream/30 bg-white">
              <div className="absolute inset-0 barber-pole-stripes"></div>
              <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-cream/80 rounded-t-full"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-cream/80 rounded-b-full"></div>
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold text-cream">
              J.ROD<span className="text-forest">.</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-cream/70 hover:text-cream font-sans text-sm uppercase tracking-[0.15em] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <a href="#book" className="btn-primary">
              Book Now
            </a>
          </div>

          {/* Mobile Menu Button - larger touch target */}
          <button
            className="md:hidden text-cream p-3 -mr-2 touch-manipulation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <IoCloseOutline className="w-7 h-7" />
            ) : (
              <IoMenuOutline className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - full screen overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-forest-dark/98 backdrop-blur-lg border-t border-cream/10 min-h-[calc(100vh-4rem)]">
          <div className="px-6 py-8 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-cream/80 hover:text-cream hover:bg-cream/5 font-sans text-lg uppercase tracking-[0.15em] transition-colors py-4 px-2 -mx-2 rounded touch-manipulation"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6">
              <a href="#book" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary block text-center w-full">
                Book Now
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.scrollY * 0.3);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax - classic barbershop */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(28,25,23,0.4) 0%, rgba(28,25,23,0.7) 60%, rgba(28,25,23,1) 100%),
            url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop')
          `,
          transform: `translateY(${parallaxOffset}px)`,
        }}
      />

      {/* Golden glow effect */}
      <div className="absolute inset-0 forest-glow" />

      {/* Warm glow at bottom */}
      <div className="absolute inset-0 sage-glow" />

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <p className="section-subheading mb-4 sm:mb-6 animate-fade-in-down text-xs sm:text-sm">
          Auburn, Alabama
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-cream mb-4 sm:mb-6 animate-fade-in leading-tight">
          J.ROD
          <br />
          <span className="text-gradient">STUDIOS</span>
        </h1>
        <p className="text-cream/60 font-sans text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8 sm:mb-10 animate-fade-in-up px-4">
          Premium cuts. Classic craftsmanship. Where tradition meets modern style.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-4">
          <a href="#book" className="btn-primary w-full sm:w-auto">
            Book Appointment
          </a>
          <a href="#services" className="btn-outline w-full sm:w-auto">
            View Services
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#services"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cream/50 hover:text-cream transition-colors animate-bounce"
      >
        <IoChevronDown className="w-8 h-8" />
      </a>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 cream-gradient" />
    </section>
  );
}

// Services Section (Display only)
function ServicesSection() {
  const services = [
    {
      name: "Regular Cut",
      description: "Classic precision cut tailored to your style",
      price: "$30",
      duration: "30 min",
    },
    {
      name: "Skin Fade",
      description: "Sharp, clean fade down to the skin",
      price: "$30",
      duration: "45 min",
    },
    {
      name: "Beard Service",
      description: "Professional trim, shape, and conditioning",
      price: "$20",
      duration: "30 min",
    },
    {
      name: "Haircut & Beard",
      description: "Complete grooming experience",
      price: "$45",
      duration: "50 min",
    },
    {
      name: "Hot Towel Shave",
      description: "Luxurious traditional straight razor shave",
      price: "$65",
      duration: "55 min",
    },
    {
      name: "Line Up",
      description: "Clean edges and sharp lines",
      price: "$10",
      duration: "15 min",
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-32 relative">
      {/* Background texture */}
      <div className="absolute inset-0 bg-sage-glow opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <p className="section-subheading mb-3 sm:mb-4 text-xs sm:text-sm">What We Offer</p>
          <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Services & Pricing</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {services.map((service, index) => (
            <AnimatedSection key={service.name} delay={index * 50}>
              <button
                onClick={() => {
                  const bookSection = document.getElementById("book");
                  if (bookSection) {
                    bookSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group bg-cream-light border border-forest/10 p-5 sm:p-8 hover:border-forest/30 active:border-forest/50 transition-all duration-500 h-full touch-manipulation w-full text-left cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4 gap-4">
                  <h3 className="font-serif text-xl sm:text-2xl text-forest group-hover:text-forest-light transition-colors">
                    {service.name}
                  </h3>
                  <span className="font-serif text-2xl sm:text-3xl text-forest flex-shrink-0">
                    {service.price}
                  </span>
                </div>
                <p className="text-forest/60 mb-3 sm:mb-4 font-sans text-sm sm:text-base">
                  {service.description}
                </p>
                <p className="text-xs sm:text-sm text-sage-dark uppercase tracking-wider">
                  {service.duration}
                </p>
              </button>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={300} className="text-center mt-8 sm:mt-12 px-4">
          <a href="#book" className="btn-primary w-full sm:w-auto">
            Book Your Service
          </a>
        </AnimatedSection>
      </div>
    </section>
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

  // Calculate 2 weeks from today
  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  const isDisabled = (date: Date) => {
    // Disable if: in the past, on Sunday, or more than 2 weeks in advance
    return date < today || date.getDay() === 0 || date > twoWeeksFromNow;
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return d1.toDateString() === d2.toDateString();
  };

  return (
    <div className="bg-cream-light border border-forest/10 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-3 hover:bg-forest/10 active:bg-forest/20 rounded transition-colors text-forest/70 hover:text-forest touch-manipulation"
          aria-label="Previous month"
        >
          <IoChevronBack className="w-5 h-5" />
        </button>
        <h3 className="font-serif text-lg sm:text-xl text-forest">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-3 hover:bg-forest/10 active:bg-forest/20 rounded transition-colors text-forest/70 hover:text-forest rotate-180 touch-manipulation"
          aria-label="Next month"
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
          <div key={index} className="aspect-square min-h-[44px]">
            {date && (
              <button
                onClick={() => !isDisabled(date) && onDateSelect(date)}
                disabled={isDisabled(date)}
                className={`w-full h-full flex items-center justify-center text-sm sm:text-base font-sans transition-all touch-manipulation ${
                  isSameDay(date, selectedDate)
                    ? "bg-forest text-cream font-semibold"
                    : isDisabled(date)
                    ? "text-forest/20 cursor-not-allowed"
                    : isSameDay(date, today)
                    ? "border border-forest/50 text-forest hover:bg-forest/20 active:bg-forest/30"
                    : "text-forest/70 hover:bg-forest/10 active:bg-forest/20"
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
      <div className="bg-cream-light border border-forest/10 p-6 sm:p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-cream-light border border-forest/10 p-6 sm:p-8">
        <p className="text-center text-forest/50 py-4">
          No available times for this date.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream-light border border-forest/10 p-4 sm:p-6">
      <h3 className="font-serif text-lg text-forest mb-4">Available Times</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onTimeSelect(slot)}
            className={`py-3 sm:py-3 px-2 sm:px-4 text-sm font-sans transition-all border touch-manipulation min-h-[48px] ${
              selectedTime === slot
                ? "bg-forest border-forest text-cream font-semibold"
                : "border-forest/20 text-forest/70 hover:border-forest/50 active:border-forest hover:text-forest active:bg-forest/10"
            }`}
          >
            {formatTime(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Booking Section with full flow
function BookingSection() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [addOnServices, setAddOnServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const steps = [
    { id: 1, title: "Service" },
    { id: 2, title: "Date" },
    { id: 3, title: "Time" },
    { id: 4, title: "Extras" },
    { id: 5, title: "Details" },
  ];

  // Calculate totals including add-ons
  const totalPrice = (selectedService?.price || 0) + addOnServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = (selectedService?.duration || 0) + addOnServices.reduce((sum, s) => sum + s.duration, 0);

  const toggleAddOn = (service: Service) => {
    setAddOnServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const isAddOnSelected = (serviceId: string) => {
    return addOnServices.some((s) => s.id === serviceId);
  };

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    }
    fetchServices();
  }, []);

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
    setCurrentStep(4); // Go to Add-ons step
  };

  const handleAddOnsNext = () => {
    setCurrentStep(5); // Go to Details step
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <section id="book" className="py-16 sm:py-24 lg:py-32 bg-forest-dark relative">
      <div className="absolute inset-0 grain-overlay" />
      <div className="absolute inset-0 forest-glow opacity-30" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-8 sm:mb-12">
          <p className="section-subheading mb-3 sm:mb-4 text-xs sm:text-sm">Schedule Your Visit</p>
          <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Book Appointment</h2>
        </AnimatedSection>

        {/* Stepper */}
        <div className="w-full py-4 sm:py-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto px-2">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-sans text-sm font-semibold transition-all border ${
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
                      className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-sans uppercase tracking-wider ${
                        isCurrent ? "text-cream" : "text-cream/40"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-1.5 sm:mx-3 ${
                        isCompleted ? "bg-forest" : "bg-cream/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 1 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-cream/50 hover:text-cream mb-6 transition-colors"
          >
            <IoChevronBack className="w-5 h-5" />
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
          <AnimatedSection>
            <h3 className="font-serif text-xl sm:text-2xl text-cream mb-4 sm:mb-6">Select a Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-1">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 sm:p-6 text-left transition-all border touch-manipulation ${
                    selectedService?.id === service.id
                      ? "bg-cream-light border-forest"
                      : "bg-cream-light border-forest/10 hover:border-forest/30 active:border-forest/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <h4 className="font-serif text-lg sm:text-xl text-forest">{service.name}</h4>
                    <span className="font-serif text-xl sm:text-2xl text-forest flex-shrink-0">
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
          </AnimatedSection>
        )}

        {/* Step 2: Select Date */}
        {currentStep === 2 && (
          <AnimatedSection>
            <h3 className="font-serif text-2xl text-cream mb-6">Select a Date</h3>
            <div className="max-w-md mx-auto">
              <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
              <p className="text-center text-cream/40 text-sm mt-4">Closed on Sundays. Bookings available up to 2 weeks in advance.</p>
            </div>
          </AnimatedSection>
        )}

        {/* Step 3: Select Time */}
        {currentStep === 3 && (
          <AnimatedSection>
            <h3 className="font-serif text-2xl text-cream mb-2">Select a Time</h3>
            {selectedDate && (
              <p className="text-cream/50 mb-6">{formatDate(selectedDate)}</p>
            )}
            <TimeSlots
              slots={availableSlots}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              isLoading={isLoadingSlots}
            />
          </AnimatedSection>
        )}

        {/* Step 4: Add-ons */}
        {currentStep === 4 && (
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add-ons List */}
              <div className="lg:col-span-2">
                <h3 className="font-serif text-2xl text-cream mb-6">Add more to your appointment?</h3>
                <div className="space-y-1">
                  {services
                    .filter((s) => s.id !== selectedService?.id)
                    .map((service) => {
                      const isSelected = isAddOnSelected(service.id);
                      return (
                        <button
                          key={service.id}
                          onClick={() => toggleAddOn(service)}
                          className={`w-full p-4 text-left transition-all border-b border-forest/10 ${
                            isSelected ? "bg-forest/10" : "hover:bg-cream-light/50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-cream">{service.name}</h4>
                              {service.description && (
                                <p className="text-cream/50 text-sm mt-1 line-clamp-2">{service.description}</p>
                              )}
                              <p className="text-cream/70 text-sm mt-1">
                                {formatPrice(service.price)} · {formatDuration(service.duration)}
                              </p>
                              {isSelected && (
                                <p className="text-forest text-sm mt-2 flex items-center gap-1">
                                  <IoCheckmarkCircle className="w-4 h-4" />
                                  Added
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-cream-light border border-forest/10 p-4 sticky top-24">
                  <h4 className="font-serif text-lg text-forest mb-4">Appointment summary</h4>

                  <div className="border border-forest/10 rounded mb-4">
                    <div className="p-3 border-b border-forest/10">
                      <p className="font-semibold text-forest">{selectedService?.name}</p>
                      <p className="text-forest/60 text-sm">
                        {selectedService && formatPrice(selectedService.price)} · {selectedService && formatDuration(selectedService.duration)}
                      </p>
                    </div>

                    {addOnServices.map((service) => (
                      <div key={service.id} className="p-3 border-b border-forest/10 last:border-b-0 flex justify-between items-center">
                        <div>
                          <p className="text-forest">{service.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-forest">{formatPrice(service.price)}</span>
                          <button
                            onClick={() => toggleAddOn(service)}
                            className="text-forest/50 hover:text-forest p-1"
                            aria-label="Remove"
                          >
                            <IoCloseOutline className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-4 py-2 border-t border-forest/10">
                    <span className="font-semibold text-forest">Total</span>
                    <span className="font-serif text-xl text-forest">{formatPrice(totalPrice)}</span>
                  </div>

                  <button
                    onClick={handleAddOnsNext}
                    className="w-full btn-primary"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Step 5: Contact Details */}
        {currentStep === 5 && (
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Summary */}
              <div className="bg-cream-light border border-forest/10 p-4 sm:p-6 order-2 lg:order-1">
                <h3 className="font-serif text-lg sm:text-xl text-forest mb-4 sm:mb-6">Booking Summary</h3>
                <div className="space-y-3 sm:space-y-4">
                  {/* Main Service */}
                  <div className="py-2 border-b border-forest/10">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-forest font-medium">{selectedService?.name}</span>
                      <span className="text-forest">{selectedService && formatPrice(selectedService.price)}</span>
                    </div>
                    <p className="text-forest/50 text-xs mt-1">{selectedService && formatDuration(selectedService.duration)}</p>
                  </div>

                  {/* Add-on Services */}
                  {addOnServices.map((service) => (
                    <div key={service.id} className="py-2 border-b border-forest/10">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-forest">{service.name}</span>
                        <span className="text-forest">{formatPrice(service.price)}</span>
                      </div>
                      <p className="text-forest/50 text-xs mt-1">{formatDuration(service.duration)}</p>
                    </div>
                  ))}

                  <div className="flex justify-between py-2 border-b border-forest/10 text-sm sm:text-base">
                    <span className="text-forest/50">Date</span>
                    <span className="text-forest">{selectedDate && formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-forest/10 text-sm sm:text-base">
                    <span className="text-forest/50">Time</span>
                    <span className="text-forest">{selectedTime && formatTime(selectedTime)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-forest/10 text-sm sm:text-base">
                    <span className="text-forest/50">Total Duration</span>
                    <span className="text-forest">{formatDuration(totalDuration)}</span>
                  </div>
                  <div className="flex justify-between py-3 sm:py-4">
                    <span className="text-forest font-semibold">Total</span>
                    <span className="font-serif text-xl sm:text-2xl text-forest">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-cream-light border border-forest/10 p-4 sm:p-6 order-1 lg:order-2">
                <h3 className="font-serif text-lg sm:text-xl text-forest mb-4 sm:mb-6">Your Details</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-forest/70 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors text-base"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-forest/70 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors text-base"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-forest/70 uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors text-base"
                      placeholder="(555) 123-4567"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-forest/70 uppercase tracking-wider mb-2">Notes (optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors resize-none text-base"
                      placeholder="Any special requests..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 min-h-[48px]"
                  >
                    {isSubmitting ? "Booking..." : "Confirm Booking"}
                  </button>
                </form>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Barbershop background accent */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-cover bg-center hidden sm:block"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop')`,
          maskImage: "linear-gradient(to left, black, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative mx-4 sm:mx-0">
              <div className="absolute -inset-3 sm:-inset-4 border border-forest/20" />
              <div
                className="aspect-[4/5] sm:aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop')`,
                }}
              />
              {/* Accent block - hidden on mobile */}
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-sage/10 border border-sage/30 hidden sm:block" />
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection delay={200}>
            <p className="section-subheading mb-3 sm:mb-4 text-xs sm:text-sm">Our Story</p>
            <h2 className="section-heading mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Craft Meets
              <br />
              <span className="text-gradient">Confidence</span>
            </h2>
            <div className="space-y-4 sm:space-y-6 text-forest/70 font-sans leading-relaxed text-sm sm:text-base">
              <p>
                At J.ROD Studios, we believe a great haircut is more than just
                grooming—it&apos;s an experience. Founded with the vision of bringing
                premium California-style barbering to Auburn, we&apos;ve created a
                relaxed space where everyone feels welcome.
              </p>
              <p>
                Our team brings years of experience and a genuine passion for
                the craft. Every cut is personalized, every detail matters, and
                every client leaves feeling their best.
              </p>
              <p className="hidden sm:block">
                Step into our studio and experience the difference that true
                attention to detail makes. From classic cuts to contemporary
                styles, we&apos;ve got you covered.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-forest/10">
              <div className="text-center sm:text-left">
                <p className="font-serif text-2xl sm:text-4xl text-forest mb-1 sm:mb-2">5+</p>
                <p className="text-forest/50 text-xs sm:text-sm uppercase tracking-wider">
                  Years
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-serif text-2xl sm:text-4xl text-forest mb-1 sm:mb-2">2K+</p>
                <p className="text-forest/50 text-xs sm:text-sm uppercase tracking-wider">
                  Clients
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-serif text-2xl sm:text-4xl text-forest mb-1 sm:mb-2">5</p>
                <p className="text-forest/50 text-xs sm:text-sm uppercase tracking-wider">
                  Stars
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Location & Hours Section
function LocationSection() {
  const hours = [
    { day: "Monday", hours: "Closed" },
    { day: "Tuesday", hours: "9:00 am - 1:00 pm", hours2: "2:00 pm - 6:00 pm" },
    { day: "Wednesday", hours: "9:00 am - 1:00 pm", hours2: "2:00 pm - 6:00 pm" },
    { day: "Thursday", hours: "9:00 am - 1:00 pm", hours2: "2:00 pm - 6:00 pm" },
    { day: "Friday", hours: "9:00 am - 1:00 pm", hours2: "2:00 pm - 6:00 pm" },
    { day: "Saturday", hours: "8:00 am - 2:00 pm" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <section id="location" className="py-16 sm:py-24 lg:py-32 bg-forest-dark relative">
      <div className="absolute inset-0 grain-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <p className="section-subheading mb-3 sm:mb-4 text-xs sm:text-sm">Find Us</p>
          <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Location & Hours</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Map */}
          <AnimatedSection>
            <div className="bg-cream-dark border border-cream/10 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3342.7!2d-85.4847!3d32.6167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x888cf5b1c7e7c8c1%3A0x0!2s1315%20N%20College%20St%2C%20Auburn%2C%20AL%2036830!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 sm:h-[400px]"
              />
            </div>

            {/* Address & Contact */}
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-cream mb-1 sm:mb-2">J.ROD STUDIOS</h3>
                <p className="text-cream/60 text-sm sm:text-base">
                  1315 N College St<br />
                  Auburn, Alabama 36830
                </p>
              </div>
              <a
                href="tel:+17148099692"
                className="text-forest hover:text-forest-light transition-colors inline-block text-sm sm:text-base py-2 touch-manipulation"
              >
                (714) 809-9692
              </a>
              <div>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=1315+N+College+St+Auburn+AL+36830"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest-light hover:text-forest transition-colors inline-flex items-center gap-2 py-2 touch-manipulation text-sm sm:text-base"
                >
                  <IoLocationOutline className="w-4 h-4" />
                  Get directions
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Hours */}
          <AnimatedSection delay={200}>
            <div className="bg-cream-light border border-forest/10 p-4 sm:p-6 lg:p-8">
              <h3 className="font-serif text-xl sm:text-2xl text-forest mb-4 sm:mb-8">Business Hours</h3>
              <div className="space-y-2 sm:space-y-4">
                {hours.map((item) => (
                  <div
                    key={item.day}
                    className={`flex justify-between py-2 sm:py-3 border-b border-forest/10 last:border-0 text-sm sm:text-base ${
                      item.hours === "Closed" ? "text-forest/50" : "text-forest"
                    }`}
                  >
                    <span className="font-medium">{item.day}</span>
                    <div className="text-right">
                      <span>{item.hours}</span>
                      {item.hours2 && (
                        <>
                          <br />
                          <span>{item.hours2}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-forest/10 border border-forest/20">
                <p className="text-forest/70 text-xs sm:text-sm">
                  <span className="text-forest font-semibold">Note:</span> Lunch break 1-2pm on weekdays.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Contact/Footer Section
function FooterSection() {
  return (
    <footer id="contact" className="bg-forest-dark relative">
      <div className="absolute inset-0 grain-overlay" />

      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-3 sm:mb-4">
              J.ROD<span className="text-forest">.</span>
            </h3>
            <p className="text-cream/50 font-sans mb-4 sm:mb-6 text-sm sm:text-base">
              Premium barbershop in Auburn, AL.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="#"
                className="w-11 h-11 sm:w-10 sm:h-10 border border-cream/20 flex items-center justify-center hover:border-forest hover:text-forest active:bg-forest/10 transition-colors touch-manipulation"
              >
                <IoLogoInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 sm:w-10 sm:h-10 border border-cream/20 flex items-center justify-center hover:border-forest hover:text-forest active:bg-forest/10 transition-colors touch-manipulation"
              >
                <IoLogoFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 sm:w-10 sm:h-10 border border-cream/20 flex items-center justify-center hover:border-forest hover:text-forest active:bg-forest/10 transition-colors touch-manipulation"
              >
                <IoLogoTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs sm:text-sm uppercase tracking-[0.15em] text-cream mb-4 sm:mb-6">
              Quick Links
            </h4>
            <div className="space-y-2 sm:space-y-3 text-cream/50 text-sm sm:text-base">
              <a href="#services" className="block hover:text-cream transition-colors py-1 touch-manipulation">Services</a>
              <a href="#book" className="block hover:text-cream transition-colors py-1 touch-manipulation">Book Now</a>
              <a href="#about" className="block hover:text-cream transition-colors py-1 touch-manipulation">About Us</a>
              <a href="#location" className="block hover:text-cream transition-colors py-1 touch-manipulation">Location</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs sm:text-sm uppercase tracking-[0.15em] text-cream mb-4 sm:mb-6">
              Contact
            </h4>
            <div className="space-y-3 sm:space-y-4 text-cream/50 text-sm sm:text-base">
              <div className="flex items-start gap-2 sm:gap-3">
                <IoLocationOutline className="w-4 h-4 sm:w-5 sm:h-5 text-forest mt-0.5 flex-shrink-0" />
                <p>
                  1315 N College St<br />
                  Auburn, AL 36830
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <IoCallOutline className="w-4 h-4 sm:w-5 sm:h-5 text-forest flex-shrink-0" />
                <a href="tel:+17148099692" className="hover:text-cream transition-colors py-1 touch-manipulation">
                  (714) 809-9692
                </a>
              </div>
            </div>
          </div>

          {/* Hours Summary */}
          <div>
            <h4 className="font-sans text-xs sm:text-sm uppercase tracking-[0.15em] text-cream mb-4 sm:mb-6">
              Hours
            </h4>
            <div className="space-y-1 sm:space-y-2 text-cream/50 text-sm sm:text-base">
              <div className="flex items-start gap-2 sm:gap-3">
                <IoTimeOutline className="w-4 h-4 sm:w-5 sm:h-5 text-forest mt-0.5 flex-shrink-0" />
                <div>
                  <p>Tue-Fri: 9AM-6PM</p>
                  <p>Sat: 8AM-2PM</p>
                  <p>Sun/Mon: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cream/30 text-xs sm:text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} J.ROD Studios. All rights reserved.
          </p>
          <div className="flex gap-6 sm:gap-8 text-cream/30 text-xs sm:text-sm">
            <a href="#" className="hover:text-cream transition-colors py-1 touch-manipulation">
              Privacy
            </a>
            <a href="#" className="hover:text-cream transition-colors py-1 touch-manipulation">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page
export default function HomePage() {
  return (
    <main className="bg-cream">
      <Navigation />
      <HeroSection />
      <div className="divider" />
      <ServicesSection />
      <BookingSection />
      <AboutSection />
      <LocationSection />
      <FooterSection />
    </main>
  );
}

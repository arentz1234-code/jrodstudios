import Link from "next/link";
import { formatPrice, formatDuration } from "@/lib/utils";
import { IoTime } from "react-icons/io5";

export const metadata = {
  title: "Services | J.ROD STUDIOS",
  description: "View our full menu of barbershop services including haircuts, beard services, and grooming.",
};

const services = [
  { id: "regular-cut", name: "Regular Cut", description: "Classic precision cut tailored to your style", price: 30, duration: 30 },
  { id: "skin-fade", name: "Skin Fade", description: "Sharp, clean fade down to the skin", price: 30, duration: 45 },
  { id: "beard-service", name: "Beard Service", description: "Professional trim, shape, and conditioning", price: 20, duration: 30 },
  { id: "haircut-beard", name: "Haircut & Beard", description: "Complete grooming experience", price: 45, duration: 50 },
  { id: "hot-towel-shave", name: "Hot Towel Shave", description: "Luxurious traditional straight razor shave", price: 65, duration: 55 },
  { id: "line-up", name: "Line Up", description: "Clean edges and sharp lines", price: 10, duration: 15 },
  { id: "facial-hair", name: "Facial Hair", description: "Mustache & goatee trim", price: 5, duration: 15 },
  { id: "eyebrows", name: "Eyebrows", description: "Eyebrow cleanup and shaping", price: 5, duration: 5 },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-forest-dark text-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-cream/70 max-w-2xl mx-auto">
            Quality cuts and grooming services to keep you looking your best.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-cream-light border border-forest/10 p-6 hover:border-forest/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-xl text-forest">
                    {service.name}
                  </h3>
                  <span className="font-serif text-2xl text-forest">
                    {formatPrice(service.price)}
                  </span>
                </div>

                <p className="text-forest/60 mb-4">{service.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-forest/50">
                    <IoTime className="w-4 h-4" />
                    <span className="text-sm">
                      {formatDuration(service.duration)}
                    </span>
                  </div>
                  <Link href={`/#book`} className="btn-primary text-sm px-4 py-2">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-forest-dark text-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Ready to Book?
          </h2>
          <p className="text-cream/70 mb-6">
            Select your service and choose a time that works for you.
          </p>
          <Link href="/#book" className="btn-primary">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}

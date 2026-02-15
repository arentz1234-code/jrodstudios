import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatPrice, formatDuration } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { IoTime } from "react-icons/io5";

export const metadata = {
  title: "Services | J.ROD STUDIOS",
  description: "View our full menu of barbershop services including haircuts, beard services, and grooming.",
};

async function getServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return services;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-ocean-deep to-ocean-medium text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-ocean-light max-w-2xl mx-auto">
            Quality cuts and grooming services to keep you looking your best.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} hover>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <span className="text-2xl font-bold text-ocean-deep">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  {service.description && (
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <IoTime className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                    <Link href={`/book?service=${service.id}`}>
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Note */}
          <div className="mt-12 bg-sand-light rounded-xl p-6 text-center">
            <p className="text-ocean-deep">
              <strong>Note:</strong> Prices may vary based on hair length and
              style complexity. All services include a consultation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-ocean-deep text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Book?
          </h2>
          <p className="text-ocean-light mb-6">
            Select your service and choose a time that works for you.
          </p>
          <Link href="/book">
            <Button size="lg" variant="secondary">
              Book Appointment
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

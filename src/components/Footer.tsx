import Link from "next/link";
import { IoLocation, IoCall, IoTime, IoMail } from "react-icons/io5";
import { BUSINESS_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-ocean-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{BUSINESS_INFO.name}</h3>
            <p className="text-ocean-light">{BUSINESS_INFO.tagline}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IoLocation className="w-5 h-5 mt-0.5 text-sand-warm" />
                <span className="text-gray-300">{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <IoCall className="w-5 h-5 text-sand-warm" />
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IoMail className="w-5 h-5 text-sand-warm" />
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IoTime className="w-5 h-5 text-sand-warm" />
                <span className="text-gray-300">{BUSINESS_INFO.hours}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ocean-medium mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

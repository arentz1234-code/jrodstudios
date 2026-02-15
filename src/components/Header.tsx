"use client";

import Link from "next/link";
import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { BUSINESS_INFO } from "@/lib/constants";
import Button from "./ui/Button";

function BarberPole() {
  return (
    <div className="relative w-6 h-10 rounded-full overflow-hidden border-2 border-forest/30 bg-white">
      <div className="absolute inset-0 barber-pole-stripes"></div>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-forest/80 rounded-t-full"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-forest/80 rounded-b-full"></div>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/book", label: "Book Now" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <BarberPole />
            <span className="text-2xl font-bold text-forest">
              {BUSINESS_INFO.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-ocean-deep font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book">
              <Button size="sm">Book Appointment</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <IoClose className="w-6 h-6 text-ocean-deep" />
            ) : (
              <IoMenu className="w-6 h-6 text-ocean-deep" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-ocean-deep font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/book" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Book Appointment</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

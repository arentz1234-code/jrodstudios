"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  IoHome,
  IoCalendar,
  IoCut,
  IoSettings,
  IoList,
  IoLogOut,
  IoMenu,
  IoClose,
} from "react-icons/io5";

const navItems = [
  { href: "/admin", icon: IoHome, label: "Dashboard" },
  { href: "/admin/bookings", icon: IoList, label: "Bookings" },
  { href: "/admin/calendar", icon: IoCalendar, label: "Calendar" },
  { href: "/admin/services", icon: IoCut, label: "Services" },
  { href: "/admin/settings", icon: IoSettings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-forest-dark text-cream flex items-center justify-between px-4 z-50">
        <Link href="/admin" className="font-serif text-lg font-bold">
          {BUSINESS_INFO.name}
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-forest/50 rounded-lg"
        >
          {mobileMenuOpen ? (
            <IoClose className="w-6 h-6" />
          ) : (
            <IoMenu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <aside
        className={cn(
          "lg:hidden fixed top-14 left-0 bottom-16 w-64 bg-forest-dark text-cream z-50 transform transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-forest text-cream"
                        : "text-cream/70 hover:bg-forest/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cream/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-cream/70 hover:bg-forest/50 rounded-lg transition-colors"
          >
            <IoLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-forest-dark text-cream flex items-center justify-around z-50 border-t border-cream/10">
        {navItems.slice(0, 4).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[60px]",
                isActive ? "text-forest" : "text-cream/60"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-cream/60"
        >
          <IoMenu className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-forest-dark text-cream flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-cream/10">
          <Link href="/admin" className="font-serif text-xl font-bold">
            {BUSINESS_INFO.name}
          </Link>
          <p className="text-cream/50 text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-forest text-cream"
                        : "text-cream/70 hover:bg-forest/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-cream/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-cream/70 hover:bg-forest/50 rounded-lg transition-colors"
          >
            <IoLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  IoHome,
  IoCalendar,
  IoCut,
  IoSettings,
  IoList,
  IoLogOut,
} from "react-icons/io5";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", icon: IoHome, label: "Dashboard" },
  { href: "/admin/bookings", icon: IoList, label: "Bookings" },
  { href: "/admin/calendar", icon: IoCalendar, label: "Calendar" },
  { href: "/admin/services", icon: IoCut, label: "Services" },
  { href: "/admin/settings", icon: IoSettings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-ocean-deep text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-ocean-medium">
        <Link href="/admin" className="text-xl font-bold">
          {BUSINESS_INFO.name}
        </Link>
        <p className="text-ocean-light text-sm mt-1">Admin Dashboard</p>
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
                      ? "bg-ocean-medium text-white"
                      : "text-ocean-light hover:bg-ocean-medium/50"
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
      <div className="p-4 border-t border-ocean-medium">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full text-ocean-light hover:bg-ocean-medium/50 rounded-lg transition-colors"
        >
          <IoLogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

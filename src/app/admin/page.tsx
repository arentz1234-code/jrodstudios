"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { formatPrice, formatTime } from "@/lib/utils";
import { IoCalendar, IoCheckmark, IoCash, IoTime, IoAdd, IoDownload, IoRefresh } from "react-icons/io5";
import Link from "next/link";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    name: string;
    price: number;
    duration: number;
  };
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Calculate stats
  const today = new Date().toDateString();
  const todayBookings = bookings.filter(
    (b) => new Date(b.date).toDateString() === today && b.status !== "cancelled"
  );
  const completedToday = todayBookings.filter((b) => b.status === "completed").length;
  const todayRevenue = todayBookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.service.price, 0);

  // This week's bookings
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const thisWeekBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate >= startOfWeek && bookingDate < endOfWeek && b.status !== "cancelled";
  });

  // Upcoming bookings (next 7 days, not including today's completed)
  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return bookingDate >= todayDate && b.status === "confirmed";
  }).sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const handleExportCSV = () => {
    const headers = ["Date", "Time", "Customer", "Phone", "Service", "Price", "Status"];
    const rows = bookings.map((b) => [
      new Date(b.date).toLocaleDateString(),
      formatTime(b.startTime),
      b.customerName,
      b.customerPhone,
      b.service.name,
      `$${b.service.price}`,
      b.status,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="py-4 lg:py-0">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={fetchBookings}
            className="lg:hidden p-2 text-gray-700 bg-white border border-gray-300 rounded-lg"
            title="Refresh"
          >
            <IoRefresh className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex gap-2 lg:hidden">
          <Link
            href="/admin/bookings?action=new"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-forest rounded-lg active:bg-forest-light"
          >
            <IoAdd className="w-5 h-5" />
            Quick Book
          </Link>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg"
          >
            <IoDownload className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex gap-2 justify-end -mt-10">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <IoRefresh className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <IoDownload className="w-4 h-4" />
            Export CSV
          </button>
          <Link
            href="/admin/bookings?action=new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-forest rounded-lg hover:bg-forest-light"
          >
            <IoAdd className="w-4 h-4" />
            Quick Book
          </Link>
        </div>
      </div>

      {/* Stats - 2x2 grid on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <div className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-forest/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <IoCalendar className="w-5 h-5 lg:w-6 lg:h-6 text-forest" />
              </div>
              <div className="min-w-0">
                <p className="text-xs lg:text-sm text-gray-500 truncate">Today</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : todayBookings.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IoCheckmark className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs lg:text-sm text-gray-500 truncate">Done</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : completedToday}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sage/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <IoCash className="w-5 h-5 lg:w-6 lg:h-6 text-sage-dark" />
              </div>
              <div className="min-w-0">
                <p className="text-xs lg:text-sm text-gray-500 truncate">Revenue</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : formatPrice(todayRevenue)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IoTime className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs lg:text-sm text-gray-500 truncate">Week</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : thisWeekBookings.length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule Cards - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Today's Schedule */}
        <Card>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                Today
              </h2>
              <Link
                href="/admin/calendar"
                className="text-forest hover:text-forest-light text-sm font-medium"
              >
                Calendar
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
              </div>
            ) : todayBookings.length === 0 ? (
              <div className="text-center py-6 lg:py-8 text-gray-500 text-sm">
                No bookings for today
              </div>
            ) : (
              <div className="space-y-2 lg:space-y-3">
                {todayBookings
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        booking.status === "completed"
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                        <div className="text-sm font-medium text-gray-900 w-14 lg:w-16 flex-shrink-0">
                          {formatTime(booking.startTime)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                            {booking.customerName}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500 truncate">
                            {booking.service.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-semibold text-forest text-sm lg:text-base">
                          {formatPrice(booking.service.price)}
                        </p>
                        <span
                          className={`text-[10px] lg:text-xs px-2 py-0.5 rounded-full ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                Upcoming
              </h2>
              <Link
                href="/admin/bookings"
                className="text-forest hover:text-forest-light text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-6 lg:py-8 text-gray-500 text-sm">
                No upcoming bookings
              </div>
            ) : (
              <div className="space-y-2 lg:space-y-3">
                {upcomingBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                        {booking.customerName}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 truncate">
                        {booking.service.name}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs lg:text-sm font-medium text-gray-900">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {formatTime(booking.startTime)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Stats - Hidden on mobile for cleaner UI */}
      <Card className="mt-4 lg:mt-6 hidden lg:block">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : bookings.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? "..." : bookings.filter((b) => b.status === "completed").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">
                {isLoading ? "..." : bookings.filter((b) => b.status === "cancelled").length}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

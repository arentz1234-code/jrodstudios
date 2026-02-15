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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-forest/20 rounded-lg flex items-center justify-center">
                <IoCalendar className="w-6 h-6 text-forest" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : todayBookings.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IoCheckmark className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : completedToday}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sage/20 rounded-lg flex items-center justify-center">
                <IoCash className="w-6 h-6 text-sage-dark" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : formatPrice(todayRevenue)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <IoTime className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : thisWeekBookings.length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Today&apos;s Schedule
              </h2>
              <Link
                href="/admin/calendar"
                className="text-forest hover:text-forest-light text-sm font-medium"
              >
                View Calendar
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
              </div>
            ) : todayBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No bookings scheduled for today
              </div>
            ) : (
              <div className="space-y-3">
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
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900 w-16">
                          {formatTime(booking.startTime)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.customerName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.service.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-forest">
                          {formatPrice(booking.service.price)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
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
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Bookings
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
              <div className="text-center py-8 text-gray-500">
                No upcoming bookings
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.service.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
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

      {/* Quick Stats */}
      <Card className="mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

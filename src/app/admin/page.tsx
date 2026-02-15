import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatDateShort, formatTime, formatPrice } from "@/lib/utils";
import { startOfDay, endOfDay, addDays } from "date-fns";
import { IoCalendar, IoCheckmark, IoCash, IoTime } from "react-icons/io5";
import Link from "next/link";

async function getDashboardData() {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const weekEnd = endOfDay(addDays(today, 7));

  const [todayBookings, upcomingBookings, completedToday, totalRevenue] =
    await Promise.all([
      prisma.booking.findMany({
        where: {
          date: { gte: todayStart, lte: todayEnd },
          status: "confirmed",
        },
        include: { service: true },
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.count({
        where: {
          date: { gte: todayStart, lte: weekEnd },
          status: "confirmed",
        },
      }),
      prisma.booking.count({
        where: {
          date: { gte: todayStart, lte: todayEnd },
          status: "completed",
        },
      }),
      prisma.booking.findMany({
        where: {
          date: { gte: todayStart, lte: todayEnd },
          status: { in: ["confirmed", "completed"] },
        },
        include: { service: true },
      }),
    ]);

  const revenue = totalRevenue.reduce(
    (sum, booking) => sum + booking.service.price,
    0
  );

  return {
    todayBookings,
    upcomingCount: upcomingBookings,
    completedCount: completedToday,
    todayRevenue: revenue,
  };
}

export default async function AdminDashboard() {
  const { todayBookings, upcomingCount, completedCount, todayRevenue } =
    await getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ocean-light/30 rounded-lg flex items-center justify-center">
                <IoCalendar className="w-6 h-6 text-ocean-deep" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayBookings.length}
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
                  {completedCount}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sand-light rounded-lg flex items-center justify-center">
                <IoCash className="w-6 h-6 text-sand-warm" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(todayRevenue)}
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
                  {upcomingCount}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Today&apos;s Schedule
            </h2>
            <Link
              href="/admin/bookings"
              className="text-ocean-medium hover:text-ocean-deep text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {todayBookings.length > 0 ? (
            <div className="space-y-3">
              {todayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-ocean-deep">
                        {formatTime(booking.startTime)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(booking.endTime)}
                      </p>
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
                    <p className="font-semibold text-ocean-deep">
                      {formatPrice(booking.service.price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.customerPhone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No bookings scheduled for today
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

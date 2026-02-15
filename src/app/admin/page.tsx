import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { IoCalendar, IoCheckmark, IoCash, IoTime } from "react-icons/io5";
import Link from "next/link";

export default function AdminDashboard() {
  // Mock data for demo
  const todayBookings: { id: string; customerName: string; startTime: string; endTime: string; customerPhone: string; service: { name: string; price: number } }[] = [];
  const upcomingCount = 0;
  const completedCount = 0;
  const todayRevenue = 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

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
              <div className="w-12 h-12 bg-sage/20 rounded-lg flex items-center justify-center">
                <IoCash className="w-6 h-6 text-sage-dark" />
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
              className="text-forest hover:text-forest-light text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="text-center py-8 text-gray-500">
            No bookings scheduled for today
          </div>
        </div>
      </Card>
    </div>
  );
}

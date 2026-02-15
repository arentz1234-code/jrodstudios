"use client";

import { formatDateShort, formatTime, formatPrice, cn } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";
import { IoEye, IoCheckmark, IoClose } from "react-icons/io5";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  service: {
    name: string;
    price: number;
    duration: number;
  };
}

interface BookingTableProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
  onViewDetails?: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  onStatusChange,
  onViewDetails,
}: BookingTableProps) {
  const getStatusBadge = (status: string) => {
    const statusInfo =
      BOOKING_STATUSES[status as keyof typeof BOOKING_STATUSES] ||
      BOOKING_STATUSES.confirmed;
    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          statusInfo.color
        )}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Customer
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Service
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Date & Time
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.customerPhone}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="text-gray-900">{booking.service.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(booking.service.price)}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="text-gray-900">
                    {formatDateShort(new Date(booking.date))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails?.(booking)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View details"
                  >
                    <IoEye className="w-4 h-4 text-gray-600" />
                  </button>
                  {booking.status === "confirmed" && (
                    <>
                      <button
                        onClick={() =>
                          onStatusChange(booking.id, "completed")
                        }
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mark complete"
                      >
                        <IoCheckmark className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() =>
                          onStatusChange(booking.id, "cancelled")
                        }
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <IoClose className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No bookings found
        </div>
      )}
    </div>
  );
}

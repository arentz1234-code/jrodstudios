"use client";

import { useState } from "react";
import { formatDateShort, formatTime, formatPrice, cn } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
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
}

export default function BookingTable({
  bookings,
  onStatusChange,
}: BookingTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
    <>
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
                      onClick={() => setSelectedBooking(booking)}
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

      {/* Booking Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Customer</h4>
              <p className="font-medium">{selectedBooking.customerName}</p>
              <p className="text-sm text-gray-600">
                {selectedBooking.customerEmail}
              </p>
              <p className="text-sm text-gray-600">
                {selectedBooking.customerPhone}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Service</h4>
              <p className="font-medium">{selectedBooking.service.name}</p>
              <p className="text-sm text-gray-600">
                {formatPrice(selectedBooking.service.price)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
              <p className="font-medium">
                {formatDateShort(new Date(selectedBooking.date))}
              </p>
              <p className="text-sm text-gray-600">
                {formatTime(selectedBooking.startTime)} -{" "}
                {formatTime(selectedBooking.endTime)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              {getStatusBadge(selectedBooking.status)}
            </div>
            {selectedBooking.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="text-gray-600">{selectedBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

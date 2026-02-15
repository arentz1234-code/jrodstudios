"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import BookingTable from "@/components/admin/BookingTable";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatPrice, formatDuration, formatTime, formatDate } from "@/lib/utils";
import { IoAdd, IoClose, IoPerson, IoCall, IoMail, IoDocument } from "react-icons/io5";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

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

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");
  const [searchDate, setSearchDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Quick Book modal
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickBookData, setQuickBookData] = useState({
    serviceId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer details modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = "/api/bookings";
      const params = new URLSearchParams();

      if (filter !== "all") {
        params.append("status", filter);
      }
      if (searchDate) {
        params.append("date", searchDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, searchDate]);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services?active=true");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, [fetchBookings]);

  useEffect(() => {
    // Open quick book modal if ?action=new
    if (searchParams.get("action") === "new") {
      setShowQuickBook(true);
    }
  }, [searchParams]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedService = services.find((s) => s.id === quickBookData.serviceId);
      if (!selectedService) return;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: quickBookData.serviceId,
          date: new Date(quickBookData.date).toISOString(),
          startTime: quickBookData.startTime,
          customerName: quickBookData.customerName,
          customerEmail: quickBookData.customerEmail,
          customerPhone: quickBookData.customerPhone,
          notes: quickBookData.notes || null,
        }),
      });

      if (res.ok) {
        setShowQuickBook(false);
        setQuickBookData({
          serviceId: "",
          date: new Date().toISOString().split("T")[0],
          startTime: "09:00",
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          notes: "",
        });
        fetchBookings();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter bookings by search term
  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      booking.customerName.toLowerCase().includes(search) ||
      booking.customerEmail.toLowerCase().includes(search) ||
      booking.customerPhone.includes(search) ||
      booking.service.name.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <Button onClick={() => setShowQuickBook(true)}>
          <IoAdd className="w-4 h-4 mr-2" />
          Add Booking
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {(["all", "confirmed", "completed", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-forest text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone..."
            />
          </div>

          <div>
            <Input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Filter by date"
            />
          </div>

          {(searchDate || searchTerm) && (
            <button
              onClick={() => {
                setSearchDate("");
                setSearchTerm("");
              }}
              className="text-sm text-forest hover:text-forest-light"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Bookings Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
          </div>
        ) : (
          <BookingTable
            bookings={filteredBookings}
            onStatusChange={handleStatusChange}
            onViewDetails={(booking) => setSelectedBooking(booking)}
          />
        )}
      </Card>

      {/* Quick Book Modal */}
      <Modal
        isOpen={showQuickBook}
        onClose={() => setShowQuickBook(false)}
        title="Add New Booking"
      >
        <form onSubmit={handleQuickBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select
              value={quickBookData.serviceId}
              onChange={(e) => setQuickBookData({ ...quickBookData, serviceId: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {formatPrice(service.price)} ({formatDuration(service.duration)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={quickBookData.date}
              onChange={(e) => setQuickBookData({ ...quickBookData, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              type="time"
              value={quickBookData.startTime}
              onChange={(e) => setQuickBookData({ ...quickBookData, startTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Customer Name"
            value={quickBookData.customerName}
            onChange={(e) => setQuickBookData({ ...quickBookData, customerName: e.target.value })}
            required
            placeholder="John Doe"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={quickBookData.customerEmail}
              onChange={(e) => setQuickBookData({ ...quickBookData, customerEmail: e.target.value })}
              required
              placeholder="john@email.com"
            />
            <Input
              label="Phone"
              type="tel"
              value={quickBookData.customerPhone}
              onChange={(e) => setQuickBookData({ ...quickBookData, customerPhone: e.target.value })}
              required
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={quickBookData.notes}
              onChange={(e) => setQuickBookData({ ...quickBookData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
              placeholder="Any special requests..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowQuickBook(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Create Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <IoPerson className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{selectedBooking.customerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <IoMail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${selectedBooking.customerEmail}`} className="text-forest hover:underline">
                    {selectedBooking.customerEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <IoCall className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${selectedBooking.customerPhone}`} className="text-forest hover:underline">
                    {selectedBooking.customerPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Booking Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="text-gray-900 font-medium">{selectedBooking.service.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-gray-900 font-medium">{formatPrice(selectedBooking.service.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-gray-900 font-medium">{formatDate(new Date(selectedBooking.date))}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-gray-900 font-medium">{formatTime(selectedBooking.startTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-gray-900 font-medium">{formatDuration(selectedBooking.service.duration)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedBooking.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : selectedBooking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <IoDocument className="w-4 h-4" />
                  Notes
                </h3>
                <p className="text-gray-700">{selectedBooking.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {selectedBooking.status === "confirmed" && (
                <>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "completed");
                      setSelectedBooking(null);
                    }}
                    className="flex-1"
                  >
                    Mark Complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "cancelled");
                      setSelectedBooking(null);
                    }}
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </>
              )}
              {selectedBooking.status === "completed" && (
                <div className="w-full text-center py-2 text-green-600 font-medium">
                  This booking has been completed
                </div>
              )}
              {selectedBooking.status === "cancelled" && (
                <div className="w-full text-center py-2 text-red-600 font-medium">
                  This booking was cancelled
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

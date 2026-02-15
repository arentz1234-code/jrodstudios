"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import BookingTable from "@/components/admin/BookingTable";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatPrice, formatDuration, formatTime, formatDate, formatDateShort } from "@/lib/utils";
import { IoAdd, IoPerson, IoCall, IoMail, IoDocument, IoCheckmark, IoClose, IoFilter } from "react-icons/io5";

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
  const [showFilters, setShowFilters] = useState(false);

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

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || styles.confirmed;
  };

  return (
    <div className="py-4 lg:py-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Bookings</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2 text-gray-700 bg-white border border-gray-300 rounded-lg"
          >
            <IoFilter className="w-5 h-5" />
          </button>
          <Button onClick={() => setShowQuickBook(true)} className="text-sm lg:text-base">
            <IoAdd className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:inline">Add Booking</span>
          </Button>
        </div>
      </div>

      {/* Filters - Collapsible on mobile */}
      <Card className={`mb-4 lg:mb-6 ${showFilters ? "block" : "hidden lg:block"}`}>
        <div className="p-3 lg:p-4 space-y-3 lg:space-y-0 lg:flex lg:flex-wrap lg:items-center lg:gap-4">
          {/* Status filters - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-1 px-1">
            {(["all", "confirmed", "completed", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  filter === status
                    ? "bg-forest text-white"
                    : "bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 lg:min-w-[200px]">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="text-base"
            />
          </div>

          {/* Date filter */}
          <div className="w-full lg:w-auto">
            <Input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="text-base"
            />
          </div>

          {(searchDate || searchTerm) && (
            <button
              onClick={() => {
                setSearchDate("");
                setSearchTerm("");
              }}
              className="text-sm text-forest font-medium py-2"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Mobile Booking Cards */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No bookings found</div>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <div
                className="p-4 active:bg-gray-50"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.service.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    {formatDateShort(new Date(booking.date))} at {formatTime(booking.startTime)}
                  </div>
                  <div className="font-semibold text-forest">
                    {formatPrice(booking.service.price)}
                  </div>
                </div>
                {booking.status === "confirmed" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(booking.id, "completed");
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium"
                    >
                      <IoCheckmark className="w-4 h-4" />
                      Complete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(booking.id, "cancelled");
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium"
                    >
                      <IoClose className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden lg:block">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
              value={quickBookData.serviceId}
              onChange={(e) => setQuickBookData({ ...quickBookData, serviceId: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent text-base"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {formatPrice(service.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={quickBookData.notes}
              onChange={(e) => setQuickBookData({ ...quickBookData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent text-base"
              placeholder="Any special requests..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowQuickBook(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* Booking Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Customer</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <IoPerson className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900">{selectedBooking.customerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <IoMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${selectedBooking.customerEmail}`} className="text-forest truncate">
                    {selectedBooking.customerEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <IoCall className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${selectedBooking.customerPhone}`} className="text-forest">
                    {selectedBooking.customerPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Appointment</h3>
              <div className="grid grid-cols-2 gap-3">
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
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <IoDocument className="w-4 h-4" />
                  Notes
                </h3>
                <p className="text-gray-700 text-sm">{selectedBooking.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {selectedBooking.status === "confirmed" && (
                <>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "completed");
                      setSelectedBooking(null);
                    }}
                    className="flex-1"
                  >
                    Complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "cancelled");
                      setSelectedBooking(null);
                    }}
                    className="flex-1 text-red-600 border-red-300"
                  >
                    Cancel
                  </Button>
                </>
              )}
              {selectedBooking.status === "completed" && (
                <div className="w-full text-center py-2 text-green-600 font-medium">
                  Booking completed
                </div>
              )}
              {selectedBooking.status === "cancelled" && (
                <div className="w-full text-center py-2 text-red-600 font-medium">
                  Booking cancelled
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

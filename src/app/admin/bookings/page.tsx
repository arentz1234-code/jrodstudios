"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import BookingTable from "@/components/admin/BookingTable";
import Input from "@/components/ui/Input";

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");
  const [searchDate, setSearchDate] = useState("");

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

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

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
                    ? "bg-ocean-deep text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <Input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Filter by date"
            />
          </div>

          {searchDate && (
            <button
              onClick={() => setSearchDate("")}
              className="text-sm text-ocean-medium hover:text-ocean-deep"
            >
              Clear date
            </button>
          )}
        </div>
      </Card>

      {/* Bookings Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-deep"></div>
          </div>
        ) : (
          <BookingTable bookings={bookings} onStatusChange={handleStatusChange} />
        )}
      </Card>
    </div>
  );
}

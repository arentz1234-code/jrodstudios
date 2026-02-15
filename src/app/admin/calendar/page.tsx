"use client";

import { useState, useEffect } from "react";
import CalendarAdmin from "@/components/admin/CalendarAdmin";

interface BlockedTime {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  allDay: boolean;
  reason: string | null;
}

interface Booking {
  id: string;
  date: string;
  startTime: string;
  customerName: string;
}

export default function CalendarPage() {
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchData = async () => {
    try {
      const [blockedRes, bookingsRes] = await Promise.all([
        fetch("/api/blocked-times"),
        fetch("/api/bookings"),
      ]);

      const blockedData = await blockedRes.json();
      const bookingsData = await bookingsRes.json();

      setBlockedTimes(blockedData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBlockTime = async (data: {
    date: Date;
    startTime?: string;
    endTime?: string;
    allDay: boolean;
    reason?: string;
  }) => {
    try {
      const res = await fetch("/api/blocked-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: data.date.toISOString(),
          startTime: data.startTime,
          endTime: data.endTime,
          allDay: data.allDay,
          reason: data.reason,
        }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error blocking time:", error);
    }
  };

  const handleUnblockTime = async (id: string) => {
    try {
      const res = await fetch(`/api/blocked-times?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error unblocking time:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendar</h1>
      <p className="text-gray-600 mb-6">
        Click on any date to view appointments or block time.
      </p>

      <CalendarAdmin
        blockedTimes={blockedTimes}
        bookings={bookings}
        onBlockTime={handleBlockTime}
        onUnblockTime={handleUnblockTime}
      />
    </div>
  );
}

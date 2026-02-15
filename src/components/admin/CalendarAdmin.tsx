"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { IoChevronBack, IoChevronForward, IoClose, IoCalendar, IoList } from "react-icons/io5";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
  endTime?: string;
  customerName: string;
  service?: {
    name: string;
    duration: number;
  };
}

interface CalendarAdminProps {
  blockedTimes: BlockedTime[];
  bookings: Booking[];
  onBlockTime: (data: {
    date: Date;
    startTime?: string;
    endTime?: string;
    allDay: boolean;
    reason?: string;
  }) => void;
  onUnblockTime: (id: string) => void;
}

// Generate time slots from 8am to 7pm
const TIME_SLOTS = Array.from({ length: 23 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minutes}`;
}).filter((t) => {
  const hour = parseInt(t.split(":")[0]);
  return hour < 19; // Stop at 6:30 PM
});

export default function CalendarAdmin({
  blockedTimes,
  bookings,
  onBlockTime,
  onUnblockTime,
}: CalendarAdminProps) {
  const [viewMode, setViewMode] = useState<"month" | "day">("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockAllDay, setBlockAllDay] = useState(true);
  const [blockStartTime, setBlockStartTime] = useState("09:00");
  const [blockEndTime, setBlockEndTime] = useState("19:00");
  const [blockReason, setBlockReason] = useState("");

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (viewMode === "month") {
      setShowBlockModal(true);
    }
  };

  const handleViewDay = (date: Date) => {
    setSelectedDate(date);
    setViewMode("day");
  };

  const handleBlockSubmit = () => {
    if (!selectedDate) return;

    onBlockTime({
      date: selectedDate,
      startTime: blockAllDay ? undefined : blockStartTime,
      endTime: blockAllDay ? undefined : blockEndTime,
      allDay: blockAllDay,
      reason: blockReason || undefined,
    });

    setShowBlockModal(false);
    setBlockAllDay(true);
    setBlockStartTime("09:00");
    setBlockEndTime("19:00");
    setBlockReason("");
  };

  const getDateInfo = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayBookings = bookings.filter(
      (b) => format(new Date(b.date), "yyyy-MM-dd") === dateStr
    );
    const dayBlocks = blockedTimes.filter(
      (b) => format(new Date(b.date), "yyyy-MM-dd") === dateStr
    );

    return { bookings: dayBookings, blocks: dayBlocks };
  };

  const renderViewToggle = () => (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => setViewMode("month")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          viewMode === "month"
            ? "bg-forest text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        <IoCalendar className="w-4 h-4" />
        Month
      </button>
      <button
        onClick={() => setViewMode("day")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          viewMode === "day"
            ? "bg-forest text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        <IoList className="w-4 h-4" />
        Day
      </button>
    </div>
  );

  const renderMonthHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoChevronBack className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-semibold">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoChevronForward className="w-5 h-5" />
      </button>
    </div>
  );

  const renderDayHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => setSelectedDate(addDays(selectedDate, -1))}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoChevronBack className="w-5 h-5" />
      </button>
      <div className="text-center">
        <h2 className="text-lg font-semibold">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="text-sm text-forest hover:underline"
        >
          Go to Today
        </button>
      </div>
      <button
        onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoChevronForward className="w-5 h-5" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 border-b">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const { bookings: dayBookings, blocks: dayBlocks } = getDateInfo(day);
        const isBlocked = dayBlocks.some((b) => b.allDay);

        days.push(
          <div
            key={day.toString()}
            onClick={() => isCurrentMonth && handleViewDay(cloneDay)}
            className={cn(
              "min-h-24 p-2 border-r border-b cursor-pointer hover:bg-gray-50 transition-colors",
              !isCurrentMonth && "bg-gray-50 text-gray-400",
              isBlocked && "bg-red-50"
            )}
          >
            <div
              className={cn(
                "text-sm font-medium mb-1",
                isToday &&
                  "w-6 h-6 bg-forest text-white rounded-full flex items-center justify-center"
              )}
            >
              {format(day, "d")}
            </div>
            <div className="space-y-1">
              {dayBookings.slice(0, 2).map((booking) => (
                <div
                  key={booking.id}
                  className="text-xs bg-forest/20 text-forest px-1 py-0.5 rounded truncate"
                >
                  {booking.startTime} {booking.customerName}
                </div>
              ))}
              {dayBookings.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{dayBookings.length - 2} more
                </div>
              )}
              {isBlocked && (
                <div className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
                  Blocked
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="border-l border-t">{rows}</div>;
  };

  const renderDayView = () => {
    const { bookings: dayBookings, blocks: dayBlocks } = getDateInfo(selectedDate);
    const isFullDayBlocked = dayBlocks.some((b) => b.allDay);
    const dayOfWeek = selectedDate.getDay();
    const isClosed = dayOfWeek === 0 || dayOfWeek === 1; // Sunday or Monday

    // Get booking for a specific time slot
    const getBookingAtTime = (time: string) => {
      return dayBookings.find((b) => b.startTime === time);
    };

    // Check if time is blocked
    const isTimeBlocked = (time: string) => {
      if (isFullDayBlocked) return true;
      return dayBlocks.some((block) => {
        if (!block.startTime || !block.endTime) return false;
        return time >= block.startTime && time < block.endTime;
      });
    };

    return (
      <div className="bg-white rounded-lg border">
        {/* Day header with block button */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{format(selectedDate, "EEEE")}</h3>
            <p className="text-sm text-gray-500">{format(selectedDate, "MMMM d, yyyy")}</p>
          </div>
          <Button
            onClick={() => setShowBlockModal(true)}
            variant="outline"
            size="sm"
          >
            Block Time
          </Button>
        </div>

        {isClosed ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium">Closed</p>
            <p className="text-sm">The shop is closed on {dayOfWeek === 0 ? "Sundays" : "Mondays"}</p>
          </div>
        ) : isFullDayBlocked ? (
          <div className="p-8 text-center">
            <p className="text-lg font-medium text-red-600">Day Blocked</p>
            <p className="text-sm text-gray-500">
              {dayBlocks.find((b) => b.allDay)?.reason || "No appointments available"}
            </p>
            <button
              onClick={() => {
                const block = dayBlocks.find((b) => b.allDay);
                if (block) onUnblockTime(block.id);
              }}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Remove Block
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {TIME_SLOTS.map((time) => {
              const booking = getBookingAtTime(time);
              const blocked = isTimeBlocked(time);
              const hour = parseInt(time.split(":")[0]);
              const isLunchBreak = hour === 13;

              // Skip if it's lunch break on weekdays
              if (isLunchBreak && dayOfWeek >= 2 && dayOfWeek <= 5) {
                return (
                  <div key={time} className="flex bg-gray-100">
                    <div className="w-20 p-3 text-sm text-gray-500 border-r flex-shrink-0">
                      {time}
                    </div>
                    <div className="flex-1 p-3 text-sm text-gray-400 italic">
                      Lunch Break
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={time}
                  className={cn(
                    "flex",
                    blocked && !booking && "bg-red-50",
                    booking && "bg-forest/10"
                  )}
                >
                  <div className="w-20 p-3 text-sm text-gray-500 border-r flex-shrink-0">
                    {time}
                  </div>
                  <div className="flex-1 p-3">
                    {booking ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-forest">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">
                            {booking.service?.name || "Appointment"}
                            {booking.endTime && ` · Until ${booking.endTime}`}
                          </p>
                        </div>
                        <span className="text-xs bg-forest text-white px-2 py-1 rounded">
                          Booked
                        </span>
                      </div>
                    ) : blocked ? (
                      <span className="text-sm text-red-600">Blocked</span>
                    ) : (
                      <span className="text-sm text-gray-400">Available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const selectedDateInfo = selectedDate ? getDateInfo(selectedDate) : null;

  return (
    <>
      {renderViewToggle()}

      {viewMode === "month" ? (
        <div className="bg-white rounded-xl shadow-md p-4">
          {renderMonthHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      ) : (
        <div>
          {renderDayHeader()}
          {renderDayView()}
        </div>
      )}

      {/* Block Time Modal */}
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={
          selectedDate
            ? `Manage ${format(selectedDate, "MMMM d, yyyy")}`
            : "Block Time"
        }
      >
        <div className="space-y-4">
          {/* Show existing blocks */}
          {selectedDateInfo && selectedDateInfo.blocks.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Blocked Times</h4>
              {selectedDateInfo.blocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between bg-red-50 p-2 rounded mb-2"
                >
                  <span className="text-sm">
                    {block.allDay
                      ? "All Day"
                      : `${block.startTime} - ${block.endTime}`}
                    {block.reason && ` - ${block.reason}`}
                  </span>
                  <button
                    onClick={() => onUnblockTime(block.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <IoClose className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Show existing bookings */}
          {selectedDateInfo && selectedDateInfo.bookings.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Bookings</h4>
              {selectedDateInfo.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-forest/10 p-2 rounded mb-2 text-sm"
                >
                  {booking.startTime} - {booking.customerName}
                </div>
              ))}
            </div>
          )}

          <hr />

          {/* Block new time */}
          <div>
            <h4 className="font-medium mb-2">Block Time</h4>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={blockAllDay}
                onChange={(e) => setBlockAllDay(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Block entire day</span>
            </label>

            {!blockAllDay && (
              <div className="flex gap-4 mb-4">
                <Input
                  type="time"
                  label="Start Time"
                  value={blockStartTime}
                  onChange={(e) => setBlockStartTime(e.target.value)}
                />
                <Input
                  type="time"
                  label="End Time"
                  value={blockEndTime}
                  onChange={(e) => setBlockEndTime(e.target.value)}
                />
              </div>
            )}

            <Input
              label="Reason (optional)"
              placeholder="e.g., Personal day, Vacation"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>

          <Button onClick={handleBlockSubmit} className="w-full">
            Block Time
          </Button>
        </div>
      </Modal>
    </>
  );
}

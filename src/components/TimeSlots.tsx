"use client";

import { cn, formatTime } from "@/lib/utils";

interface TimeSlotsProps {
  slots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  isLoading?: boolean;
}

export default function TimeSlots({
  slots,
  selectedTime,
  onTimeSelect,
  isLoading = false,
}: TimeSlotsProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-deep"></div>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-center text-gray-500 py-8">
          No available time slots for this date. Please select another date.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Times
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onTimeSelect(slot)}
            className={cn(
              "py-3 px-4 rounded-lg text-sm font-medium transition-colors",
              selectedTime === slot
                ? "bg-ocean-deep text-white"
                : "bg-gray-100 text-gray-700 hover:bg-ocean-light/30"
            )}
          >
            {formatTime(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}

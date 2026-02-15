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
  isBefore,
  startOfDay,
} from "date-fns";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  disabledDays?: number[]; // 0 = Sunday, 6 = Saturday
  minDate?: Date;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  disabledDays = [0], // Sunday closed by default
  minDate = new Date(),
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <IoChevronBack className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <IoChevronForward className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
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
        const isDisabled =
          disabledDays.includes(day.getDay()) ||
          isBefore(startOfDay(day), startOfDay(minDate));
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        days.push(
          <button
            key={day.toString()}
            onClick={() => !isDisabled && onDateSelect(cloneDay)}
            disabled={isDisabled}
            className={cn(
              "h-10 w-full flex items-center justify-center rounded-lg text-sm transition-colors",
              !isCurrentMonth && "text-gray-300",
              isCurrentMonth && !isDisabled && "text-gray-900 hover:bg-ocean-light/30",
              isDisabled && "text-gray-300 cursor-not-allowed",
              isSelected && "bg-ocean-deep text-white hover:bg-ocean-medium",
              isToday && !isSelected && "ring-2 ring-ocean-medium ring-inset"
            )}
          >
            {format(day, "d")}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

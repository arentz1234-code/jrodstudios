"use client";

import { cn, formatPrice, formatDuration } from "@/lib/utils";
import { Card } from "./ui/Card";
import { IoCheckmarkCircle, IoTime } from "react-icons/io5";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect?: (service: Service) => void;
  showSelectButton?: boolean;
}

export default function ServiceCard({
  service,
  selected = false,
  onSelect,
  showSelectButton = true,
}: ServiceCardProps) {
  return (
    <Card
      hover={!!onSelect}
      className={cn(
        "cursor-pointer transition-all duration-200",
        selected && "ring-2 ring-ocean-medium border-ocean-medium",
        onSelect && "hover:ring-2 hover:ring-ocean-light"
      )}
      onClick={() => onSelect?.(service)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
          {selected && (
            <IoCheckmarkCircle className="w-6 h-6 text-ocean-medium flex-shrink-0" />
          )}
        </div>

        {service.description && (
          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <IoTime className="w-4 h-4" />
            <span className="text-sm">{formatDuration(service.duration)}</span>
          </div>
          <span className="text-xl font-bold text-ocean-deep">
            {formatPrice(service.price)}
          </span>
        </div>

        {showSelectButton && onSelect && (
          <button
            className={cn(
              "mt-4 w-full py-2 rounded-lg font-medium transition-colors",
              selected
                ? "bg-ocean-deep text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {selected ? "Selected" : "Select"}
          </button>
        )}
      </div>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";

interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isLoading?: boolean;
}

export default function BookingForm({
  onSubmit,
  isLoading = false,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="customerName"
        label="Full Name"
        placeholder="John Doe"
        value={formData.customerName}
        onChange={(e) =>
          setFormData({ ...formData, customerName: e.target.value })
        }
        error={errors.customerName}
        required
      />

      <Input
        id="customerEmail"
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={formData.customerEmail}
        onChange={(e) =>
          setFormData({ ...formData, customerEmail: e.target.value })
        }
        error={errors.customerEmail}
        required
      />

      <Input
        id="customerPhone"
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        value={formData.customerPhone}
        onChange={(e) =>
          setFormData({ ...formData, customerPhone: e.target.value })
        }
        error={errors.customerPhone}
        required
      />

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Special Requests (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Any special requests or notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-medium focus:border-transparent placeholder:text-gray-400 resize-none"
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Confirm Booking
      </Button>
    </form>
  );
}

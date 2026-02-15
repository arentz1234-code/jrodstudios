"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DAYS_OF_WEEK } from "@/lib/constants";

interface BusinessHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export default function SettingsPage() {
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBusinessHours();
  }, []);

  const fetchBusinessHours = async () => {
    try {
      const res = await fetch("/api/business-hours");
      const data = await res.json();
      setBusinessHours(data);
    } catch (error) {
      console.error("Error fetching business hours:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHours = (dayOfWeek: number, field: string, value: string | boolean) => {
    setBusinessHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  const saveBusinessHours = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: businessHours }),
      });

      if (res.ok) {
        setMessage("Business hours saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving business hours:", error);
      setMessage("Error saving business hours");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Admin Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Role
                </label>
                <p className="text-gray-900">Administrator</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="text-gray-900">Logged In</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Info */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Info
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Admin URL:</strong>{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  /admin
                </code>
              </p>
              <p>
                <strong>Public Site:</strong>{" "}
                <a
                  href="/"
                  target="_blank"
                  className="text-ocean-medium hover:underline"
                >
                  View Site
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Business Hours */}
      <Card className="mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Business Hours
          </h2>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-deep"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {businessHours.map((hours) => (
                <div
                  key={hours.dayOfWeek}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-24">
                    <span className="font-medium">
                      {DAYS_OF_WEEK[hours.dayOfWeek]}
                    </span>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) =>
                        updateHours(hours.dayOfWeek, "isOpen", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Open</span>
                  </label>

                  {hours.isOpen && (
                    <>
                      <Input
                        type="time"
                        value={hours.openTime || "09:00"}
                        onChange={(e) =>
                          updateHours(
                            hours.dayOfWeek,
                            "openTime",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={hours.closeTime || "19:00"}
                        onChange={(e) =>
                          updateHours(
                            hours.dayOfWeek,
                            "closeTime",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                    </>
                  )}

                  {!hours.isOpen && (
                    <span className="text-gray-500 text-sm">Closed</span>
                  )}
                </div>
              ))}

              <div className="pt-4">
                <Button onClick={saveBusinessHours} isLoading={isSaving}>
                  Save Business Hours
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

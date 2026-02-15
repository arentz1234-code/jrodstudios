"use client";

import { cn } from "@/lib/utils";
import { IoCheckmark } from "react-icons/io5";

interface Step {
  id: number;
  title: string;
}

interface BookingStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function BookingStepper({
  steps,
  currentStep,
}: BookingStepperProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                    isCompleted && "bg-ocean-deep text-white",
                    isCurrent && "bg-ocean-medium text-white",
                    !isCompleted && !isCurrent && "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <IoCheckmark className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center hidden sm:block",
                    isCurrent ? "text-ocean-deep" : "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 rounded",
                    isCompleted ? "bg-ocean-deep" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary text-primary bg-background"
                    : "border-border text-muted-foreground bg-background"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    index <= currentStep ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all",
                  index < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

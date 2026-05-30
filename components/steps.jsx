"use client";

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/reui/stepper";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";

const steps = [
  { name: "Reading", key: 1 },
  { name: "Analyzing", key: 2 },
  { name: "Finish", key: 3 },
];

export function Steps() {
  return (
    <Stepper
      className="w-full max-w-md"
      defaultValue={2}
      indicators={{
        completed: <CheckIcon className="size-3.5" />,
        loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
      }}
    >
      <StepperNav className="mb-5">
        {steps.map((step, index) => (
          <StepperItem key={step.key} step={step.key} loading={step.key === 2}>
            <StepperTrigger>
              <StepperIndicator className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:border-primary data-[state=inactive]:border-muted size-5 border-2 data-[state=completed]:border-green-500 data-[state=completed]:bg-green-500 data-[state=completed]:text-white">
                <span className="bg-primary-foreground hidden size-1.5 rounded-full group-data-[state=active]/step:block"></span>
              </StepperIndicator>
            </StepperTrigger>
            {index < steps.length - 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step) => (
          <StepperContent
            className="flex w-full items-center justify-center"
            key={step.key}
            value={step.key}
          >
            {step.name}
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  );
}

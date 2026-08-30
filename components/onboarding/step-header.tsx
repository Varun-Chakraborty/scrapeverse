import { TOTAL_ONBOARDING_STEPS } from "@/lib/constants";

interface StepHeaderProps {
  step: number;
  title: string;
  description: string;
}

export function StepHeader({ step, title, description }: StepHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
        Step {step} of {TOTAL_ONBOARDING_STEPS}
      </p>
      <h2 className="font-heading mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

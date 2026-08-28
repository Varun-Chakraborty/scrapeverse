interface LoadingScreenProps {
  label?: string;
}

export function LoadingScreen({ label }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {label ? (
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-[3px] border-primary-soft border-t-primary" />
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {label}
          </p>
        </div>
      ) : (
        <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      )}
    </div>
  );
}
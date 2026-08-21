import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-primary-soft text-secondary-foreground [a]:hover:bg-[#fbdfe9]",
        success: "bg-mint text-mint-foreground",
        info: "bg-sky text-sky-foreground",
        warning: "bg-amber-soft text-amber-foreground",
        lavender: "bg-lavender text-lavender-foreground",
        destructive:
          "bg-destructive-soft text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/15",
        outline:
          "border-border bg-card text-muted-foreground [a]:hover:bg-primary-soft [a]:hover:text-secondary-foreground",
        ghost: "hover:bg-primary-soft hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

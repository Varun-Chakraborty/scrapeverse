import { isValidElement } from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent bg-clip-padding text-sm font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none select-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/25 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgb(201_54_99/0.55)] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgb(201_54_99/0.6)]",
        gradient:
          "bg-linear-to-r from-primary via-[#d94f7c] to-[#9b8cf0] bg-[length:180%_100%] bg-left text-white shadow-[0_8px_24px_-8px_rgb(201_54_99/0.55)] transition-[background-position,transform,box-shadow] duration-500 hover:bg-right hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-10px_rgb(201_54_99/0.55)]",
        outline:
          "border-border bg-card text-foreground shadow-soft hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-lift",
        secondary:
          "bg-primary-soft text-secondary-foreground hover:bg-[#fbdfe9]",
        ghost:
          "text-muted-foreground hover:bg-primary-soft hover:text-primary",
        destructive:
          "bg-destructive-soft text-destructive hover:bg-destructive/15 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline rounded-sm",
      },
      size: {
        default: "h-9 px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        xs: "h-7 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 px-3.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 px-6 text-sm [&_svg:not([class*='size-'])]:size-4",
        xl: "h-12 px-8 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const isNativeButton =
    !render || (isValidElement(render) && render.type === "button")

  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={isNativeButton}
      render={render}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#C1121F] text-white",
        live: "bg-[#E5383B] text-white animate-pulse",
        secondary: "bg-gray-100 text-[#374151]",
        outline: "border border-[#C1121F] text-[#C1121F]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

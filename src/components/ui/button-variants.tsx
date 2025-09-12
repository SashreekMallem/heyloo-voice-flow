import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Premium Heyloo AI variants
        hero: "bg-accent-gradient text-foreground font-semibold shadow-button hover:shadow-glow-electric hover:scale-105 transition-all duration-300",
        premium: "bg-hero-gradient text-foreground font-semibold border border-border/20 hover:shadow-glow hover:border-electric-blue/50 transition-all duration-300",
        ghost_premium: "text-foreground hover:bg-secondary/20 hover:text-electric-blue border border-transparent hover:border-electric-blue/30 transition-all duration-300",
        success: "bg-success-gradient text-foreground font-semibold shadow-glow-success hover:shadow-glow-electric hover:scale-105 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
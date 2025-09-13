import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Menu, X, Mic2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-accent-gradient flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Heyloo AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-electric-blue transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-foreground hover:text-electric-blue transition-colors">
              Pricing
            </a>
            <a href="#dashboard" className="text-foreground hover:text-electric-blue transition-colors">
              Dashboard
            </a>
            <a href="#contact" className="text-foreground hover:text-electric-blue transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth">
              <Button className={buttonVariants({ variant: "ghost_premium" })}>
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className={buttonVariants({ variant: "hero" })}>
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-electric-blue transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/20">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-foreground hover:text-electric-blue transition-colors px-2 py-1">
                Features
              </a>
              <a href="#pricing" className="text-foreground hover:text-electric-blue transition-colors px-2 py-1">
                Pricing
              </a>
              <a href="#dashboard" className="text-foreground hover:text-electric-blue transition-colors px-2 py-1">
                Dashboard
              </a>
              <a href="#contact" className="text-foreground hover:text-electric-blue transition-colors px-2 py-1">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/auth">
                  <Button className={buttonVariants({ variant: "ghost_premium", size: "sm" })}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className={buttonVariants({ variant: "hero", size: "sm" })}>
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
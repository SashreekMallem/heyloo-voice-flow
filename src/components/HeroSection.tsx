import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Play, Mic, Phone } from "lucide-react";
import heroImage from "@/assets/hero-ai-voice.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI Voice Agents Technology" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-hero-gradient/80" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center glow-effect">
          <Mic className="w-8 h-8 text-electric-blue" />
        </div>
      </div>
      <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-20 h-20 rounded-full bg-electric-purple/20 flex items-center justify-center glow-effect">
          <Phone className="w-10 h-10 text-electric-purple" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-electric-blue to-electric-purple bg-clip-text text-transparent">
              Heyloo AI
            </span>
            <br />
            <span className="text-foreground">Voice Agents That</span>
            <br />
            <span className="text-electric-blue">Transform Your Business</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Deploy intelligent voice agents that handle customer inquiries, sales calls, and support 24/7.
            <br />
            <span className="text-electric-blue font-semibold">Powered by cutting-edge AI that understands your business like never before.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button className={buttonVariants({ variant: "hero", size: "xl" })}>
              <Play className="w-6 h-6 mr-2" />
              Start Free Trial
            </Button>
            <Button className={buttonVariants({ variant: "ghost_premium", size: "xl" })}>
              <Mic className="w-6 h-6 mr-2" />
              Live Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-electric-blue mb-2">200ms</div>
              <div className="text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-electric-green mb-2">50+</div>
              <div className="text-muted-foreground">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-electric-purple mb-2">24/7</div>
              <div className="text-muted-foreground">Availability</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-electric-blue rounded-full flex justify-center">
          <div className="w-1 h-3 bg-electric-blue rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
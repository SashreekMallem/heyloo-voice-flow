import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: { monthly: 99, annual: 79 },
    description: "Perfect for small businesses starting with voice AI",
    features: [
      "Up to 3 voice agents",
      "500 minutes included",
      "Basic analytics dashboard",
      "Email support",
      "Standard integrations",
      "Multi-language support"
    ],
    popular: false
  },
  {
    name: "Professional",
    icon: Star,
    price: { monthly: 299, annual: 239 },
    description: "Ideal for growing businesses with advanced needs",
    features: [
      "Up to 10 voice agents",
      "2,000 minutes included",
      "Advanced analytics & reporting",
      "Priority phone support",
      "Custom integrations",
      "Advanced AI training",
      "CRM sync",
      "Call recording & transcripts"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: { monthly: 999, annual: 799 },
    description: "For large organizations with complex requirements",
    features: [
      "Unlimited voice agents",
      "10,000 minutes included",
      "White-label solution",
      "Dedicated account manager",
      "Custom AI model training",
      "On-premise deployment",
      "99.9% SLA guarantee",
      "24/7 premium support"
    ],
    popular: false
  }
];

export const PricingSection = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. All plans include our core AI technology plus $0.40 per minute usage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative ${plan.popular 
                  ? 'glass-card border-electric-blue shadow-glow-electric scale-105' 
                  : 'glass-card hover:shadow-glow'
                } transition-all duration-300 hover:transform hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-success-gradient text-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent-gradient flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-foreground" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-electric-blue mb-2">
                    ${plan.price.monthly}
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                  <div className="text-sm text-electric-green">
                    Save ${(plan.price.monthly - plan.price.annual) * 12}/year with annual billing
                  </div>
                  <CardDescription className="text-muted-foreground mt-4">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-5 h-5 text-electric-green mr-3 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={buttonVariants({ 
                      variant: plan.popular ? "hero" : "premium", 
                      size: "lg" 
                    })}
                    style={{ width: "100%" }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Cost Comparison */}
        <div className="glass-card p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent">
              Why Our Pricing Makes Sense
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-foreground mb-4">Traditional Receptionist</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Salary (40 hrs/week)</span>
                  <span className="text-foreground">$3,200/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Benefits & Taxes</span>
                  <span className="text-foreground">$800/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Sick Leave Coverage</span>
                  <span className="text-foreground">$400/month</span>
                </div>
                <div className="border-t border-border pt-2 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Cost</span>
                    <span className="text-destructive">$4,400/month</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-xl font-semibold text-foreground mb-4">Heyloo AI Professional</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subscription</span>
                  <span className="text-foreground">$299/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Call Minutes (500)</span>
                  <span className="text-foreground">$200/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Setup & Training</span>
                  <span className="text-electric-green">$0</span>
                </div>
                <div className="border-t border-border pt-2 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Cost</span>
                    <span className="text-electric-green">$499/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="text-3xl font-bold text-electric-green mb-2">
              💰 Save $3,900+ per month
            </div>
            <p className="text-muted-foreground">
              Plus get 24/7 availability, consistent service, scalable call handling, and multi-language support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
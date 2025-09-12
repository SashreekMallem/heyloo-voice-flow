import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Globe, BarChart3, Zap, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced natural language processing that understands context, emotions, and intent in real-time with GPT-4o integration."
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Deploy agents in 50+ languages with native pronunciation and cultural understanding for global reach."
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Comprehensive insights into conversation quality, customer satisfaction, and business metrics with live dashboards."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-200ms response times with global CDN and edge computing for instant, natural interactions."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption, GDPR compliance, and SOC2 certification for complete data protection."
  },
  {
    icon: Headphones,
    title: "Easy Integration",
    description: "Seamlessly integrate with existing CRM, helpdesk, and business tools via REST APIs and webhooks."
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-background-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to deploy, manage, and scale your voice AI agents across your entire business operation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="glass-card hover:shadow-glow transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-accent-gradient flex items-center justify-center mb-4 group-hover:animate-glow">
                    <Icon className="w-7 h-7 text-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of businesses already using Heyloo AI to transform their customer experience.
            Get started today with our free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-electric-blue" />
                Get in Touch
              </CardTitle>
              <CardDescription>
                Ready to see how Heyloo AI can transform your business? Let's schedule a personalized demo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your business needs and how you'd like to use voice AI..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className={buttonVariants({ variant: "hero", size: "lg" })} style={{ width: "100%" }}>
                Schedule Free Demo
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-accent-gradient flex items-center justify-center">
                    <Mail className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Email Us</h3>
                    <p className="text-muted-foreground">hello@heyloo.ai</p>
                    <p className="text-muted-foreground">support@heyloo.ai</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-success-gradient flex items-center justify-center">
                    <Phone className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Call Us</h3>
                    <p className="text-muted-foreground">+1 (555) 123-HEYLOO</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM PST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-card-gradient border border-electric-purple/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-electric-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Visit Us</h3>
                    <p className="text-muted-foreground">San Francisco, CA</p>
                    <p className="text-muted-foreground">New York, NY</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">Why Choose Heyloo AI?</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Setup Time</span>
                  <span className="text-electric-green font-semibold">&lt; 5 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="text-electric-blue font-semibold">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="text-electric-purple font-semibold">&lt; 200ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Uptime SLA</span>
                  <span className="text-electric-green font-semibold">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
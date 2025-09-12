import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { BarChart3, Phone, Clock, DollarSign, Users, Settings, TrendingUp, MessageSquare } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <section className="py-24 px-6 bg-background-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              Powerful Dashboard & Analytics
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get complete visibility into your voice agents' performance with real-time analytics, customer insights, and business intelligence.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="glass-card p-8 rounded-2xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 rounded-lg bg-accent-gradient">
              <Phone className="w-8 h-8 text-foreground mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">47</div>
              <div className="text-sm text-foreground/80">Active Agents</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-success-gradient">
              <Clock className="w-8 h-8 text-foreground mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">12,847</div>
              <div className="text-sm text-foreground/80">Minutes Used</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card-gradient border border-electric-blue/20">
              <DollarSign className="w-8 h-8 text-electric-blue mx-auto mb-3" />
              <div className="text-2xl font-bold text-electric-blue">$5,138</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card-gradient border border-electric-green/20">
              <TrendingUp className="w-8 h-8 text-electric-green mx-auto mb-3" />
              <div className="text-2xl font-bold text-electric-green">94.2%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>

          {/* Mock Dashboard Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <BarChart3 className="w-5 h-5 mr-2 text-electric-blue" />
                  Call Volume Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-hero-gradient rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground">📊 Interactive charts showing call patterns, peak hours, and performance metrics</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <MessageSquare className="w-5 h-5 mr-2 text-electric-purple" />
                  Recent Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-background-secondary/50">
                    <div>
                      <div className="text-sm font-medium text-foreground">Customer Support</div>
                      <div className="text-xs text-muted-foreground">2 min ago</div>
                    </div>
                    <div className="w-2 h-2 bg-electric-green rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background-secondary/50">
                    <div>
                      <div className="text-sm font-medium text-foreground">Sales Inquiry</div>
                      <div className="text-xs text-muted-foreground">5 min ago</div>
                    </div>
                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background-secondary/50">
                    <div>
                      <div className="text-sm font-medium text-foreground">Appointment</div>
                      <div className="text-xs text-muted-foreground">12 min ago</div>
                    </div>
                    <div className="w-2 h-2 bg-electric-purple rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass-card hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent-gradient flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-foreground">Customer Management</CardTitle>
              <CardDescription>
                Comprehensive CRM with customer profiles, interaction history, and satisfaction tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Customer interaction timeline</li>
                <li>• Satisfaction scoring</li>
                <li>• Automated follow-ups</li>
                <li>• Integration with existing CRM</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-success-gradient flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-foreground">Agent Configuration</CardTitle>
              <CardDescription>
                Customize your voice agents with business-specific knowledge, greetings, and responses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Custom conversation flows</li>
                <li>• Business catalog integration</li>
                <li>• Multi-language setup</li>
                <li>• Personality customization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-card-gradient border border-electric-blue/20 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-electric-blue" />
              </div>
              <CardTitle className="text-foreground">Billing & Payments</CardTitle>
              <CardDescription>
                Transparent billing with detailed usage tracking and flexible payment options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Real-time usage monitoring</li>
                <li>• Automated invoicing</li>
                <li>• Cost optimization insights</li>
                <li>• Multiple payment methods</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button className={buttonVariants({ variant: "hero", size: "xl" })}>
            <BarChart3 className="w-6 h-6 mr-2" />
            View Full Dashboard Demo
          </Button>
        </div>
      </div>
    </section>
  );
};